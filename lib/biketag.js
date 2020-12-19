const imgur = require('imgur')
const reddit = require('snoowrap')
const nodeCache = require('node-cache')
const { extname } = require('path')
const merge = require('deepmerge')
const namespace = 'biketag'
let singleton

class BikeTagModel {
    constructor(opts) {
        return {
            ...opts,
        }
    }
}

class BikeTagApi {
    /// TODO: add jsdocs here and tie this class to the controller in controllers/api/index using res.locals
    constructor(logger = (m) => m, cache) {
        const cacheOptions = {
            stdTTL: 600,
            checkperiod: 450,
        }
        this.cacheKeys = {
            albumHash: `imgur::`,
            redditPosts: `reddit::`,
            bikeTagImage: `biketag::`,
            bikeTagsByUser: `usertags::`,
        }
        this.setLogger(logger)
        this.setCache(cache || new nodeCache(cacheOptions, this.cacheKeys))

        this.log(`BikeTag Cache Configured`, cache)
    }

    getBikeTagImages(imgurClientID, albumHash, callback, uncached = false) {
        const cacheKey = `${this.cacheKeys.albumHash}${imgurClientID}::${albumHash}`
        const getBikeTagImagesResponse = this.cache.get(cacheKey)

        if (!getBikeTagImagesResponse || uncached) {
            return this.getImgurAlbumInfo(imgurClientID, albumHash, (data) => {
                const images = this.getImagesByBikeTagNumber(data.images)
                this.cache.set(cacheKey, images)

                this.log('got new getBikeTagImages', { cacheKey, image: { images } })
                return callback(images)
            }).catch((e) => console.log('ERROR: getBikeTagImages:', { e }))
        } else {
            this.log('getting cached getBikeTagImages', { cacheKey, getBikeTagImagesResponse })
            return callback(getBikeTagImagesResponse)
        }
    }

    getBiketagImageUrl(url, size = '') {
        const ext = extname(url)
        /// Make sure the image type is supported
        if (['.jpg', '.jpeg', '.png', '.bmp'].indexOf(ext) === -1) return url

        switch (size) {
            default:
            case 'original':
            case '':
                break

            case 'small':
                size = 's'
            case 's':
                break

            case 'medium':
                size = 's'
            case 'm':
                break

            case 'large':
                size = 'l'
            case 'l':
                break
        }

        return url.replace(ext, `${size}${ext}`)
    }

    getBikeTagInformation(
        imgurClientID,
        tagNumberRequested,
        albumHash,
        callback,
        uncached = false,
    ) {
        const cacheKey = `${this.cacheKeys.bikeTagImage}${albumHash}::${tagNumberRequested}`
        const getBikeTagInformationResponse = this.cache.get(cacheKey)

        if (!getBikeTagInformationResponse || uncached) {
            return this.getBikeTagImages(
                imgurClientID,
                albumHash,
                (images) => {
                    if (images.length) {
                        const currentTagNumber = this.getBikeTagNumberFromImage(images[0])
                        const tagNumber =
                            tagNumberRequested == 'current'
                                ? currentTagNumber
                                : parseInt(tagNumberRequested)

                        const tagData = {
                            tagNumberRequested,
                        }
                        const proofTagNumber = tagNumber > 1 ? tagNumber - 1 : 1
                        const mysteryTagNumber = tagNumber > 1 ? tagNumber : 1
                        const previousMysteryTagNumber = proofTagNumber > 1 ? tagNumber - 1 : 1

                        const currentTagIndex = this.getBikeTagNumberIndexFromImages(
                            images,
                            mysteryTagNumber,
                        )
                        const proofTagIndex = this.getBikeTagNumberIndexFromImages(
                            images,
                            proofTagNumber,
                            true,
                        )
                        const previousMysterTagIndex = this.getBikeTagNumberIndexFromImages(
                            images,
                            previousMysteryTagNumber,
                        )

                        if (currentTagIndex === -1) {
                            return callback(null)
                        }

                        const currentTag = images[currentTagIndex]
                        const currentTagURL = currentTag.link
                        const currentTagURLExt = extname(currentTagURL)
                        const proofTag = images[proofTagIndex] || {}
                        const proofText = proofTag.description
                        const imgurBaseUrl = 'https://imgur.com'
                        const creditSplit = proofText
                            ? proofText.split('by')
                            : currentTag.description.split('by')
                        const hintSplit = currentTag.description.split('hint:')

                        tagData.imgurBaseUrl = imgurBaseUrl
                        tagData.image = currentTag
                        tagData.currentTagNumber = mysteryTagNumber
                        tagData.currentTagURL = currentTagURL
                        tagData.currentTagURLExt = currentTagURLExt
                        tagData.currentTagURLThumb = currentTagURL.replace(
                            currentTagURLExt,
                            `m${currentTagURLExt}`,
                        )
                        tagData.credit = creditSplit[creditSplit.length - 1].trim()
                        tagData.hint = hintSplit.length > 1 ? hintSplit[1].trim() : ''
                        tagData.previousMysteryTag =
                            previousMysterTagIndex !== -1 ? images[previousMysterTagIndex] : {}
                        tagData.previousMysteryTagNumber = previousMysteryTagNumber
                        tagData.proofTag = proofTag
                        tagData.proofTagURL = proofTag ? `${imgurBaseUrl}/${proofTag.id}` : null
                        tagData.proofText = proofText
                        tagData.proofTagNumber = proofTagNumber

                        const bikeTagInformation = new BikeTagModel(tagData)

                        // if (!uncached)
                        this.cache.set(cacheKey, bikeTagInformation)
                        this.log('got new getBikeTagInformation', { cacheKey, bikeTagInformation })

                        return callback(bikeTagInformation)
                    }

                    return callback(null)
                },
                uncached,
            )
        } else {
            this.log('getting cached getBikeTagInformation', {
                cacheKey,
                getBikeTagInformationResponse,
            })
            return callback(getBikeTagInformationResponse)
        }
    }

    getBikeTagInformationFromRedditData(redditPostData) {
        if (!redditPostData.tagNumbers) {
            /// TODO: handle a link that is an image gallery and has only one tag number attached
            redditPostData.tagNumbers = [redditPostData.tagNumber]
        }

        const imgurBaseUrl = `https://imgur.com`
        const mysteryTagNumber = Math.max(...redditPostData.tagNumbers)
        const proofTagNumber = mysteryTagNumber - 1
        const previousMysteryTagNumber = proofTagNumber > 1 ? mysteryTagNumber - 1 : 1
        const currentTagURLIndex = redditPostData.tagNumbers.indexOf(mysteryTagNumber)
        const currentTagURL = redditPostData.tagImageURLs[currentTagURLIndex]
        const proofTagUrlIndex = redditPostData.tagNumbers.indexOf(previousMysteryTagNumber)
        const proofTagURL =
            proofTagUrlIndex !== -1 ? redditPostData.tagImageURLs[proofTagUrlIndex] : null
        const currentTagURLExt = extname(currentTagURL)

        const tagData = {
            author_flair: redditPostData.author_flair,
            foundAt: redditPostData.foundAt,
            credit: redditPostData.credit,
            hint: redditPostData.hint,
            gps: redditPostData.gps,
            discussionLink: `https://redd.it/${redditPostData.id}`,
            link: currentTagURL,

            currentTagNumber: mysteryTagNumber,
            currentTagURL,
            currentTagURLExt,
            currentTagURLThumb: currentTagURL.replace(currentTagURLExt, `m${currentTagURLExt}`),
            imgurBaseUrl,
            previousMysteryTagNumber,
            previousMysteryTag: {},
            proofTagURL,
            proofTagNumber,
        }

        tagData.image = {
            title: this.getBikeTagTitleFromData(tagData),
            description: this.getBikeTagDescriptionFromData(tagData),
            url: currentTagURL,
            link: currentTagURL,
            number: mysteryTagNumber,
        }
        if (proofTagNumber > 0) {
            tagData.proofTag = {
                title: this.getBikeTagProofTitleFromData(tagData),
                description: this.getBikeTagProofDescriptionFromData(tagData),
                url: proofTagURL,
                link: proofTagURL,
                number: proofTagNumber,
            }
            tagData.proofText = tagData.proofTag.description
        } else {
            tagData.proofText = ''
            tagData.proofTag = {}
        }
        const bikeTagInformation = new BikeTagModel(tagData)

        return bikeTagInformation
    }

    getBikeTagDescriptionFromData(data) {
        return `#${data.currentTagNumber} tag ${data.hint ? `(hint: ${data.hint})` : ''} by ${
            data.credit
        }`
    }

    getBikeTagTitleFromData(data) {
        return `${data.gps ? `(${data.gps})` : ''} {${
            data.discussionLink ? data.discussionLink : ''
        }}`
    }

    getBikeTagProofDescriptionFromData(data) {
        return `#${data.proofTagNumber} proof${
            data.foundAt ? ` found at (${data.foundAt})` : ''
        } by ${data.credit}`
    }

    getBikeTagProofTitleFromData(data) {
        return `(${data.gps ? data.gps : ''})`
    }

    getBikeTagNumberFromImage(image) {
        return image.description ? this.getTagNumbersFromText(image.description)[0] : -1
    }

    getBikeTagNumberFromRequest(req) {
        const pathTagNumber = parseInt(req.params.tagnumber)
        const bodyTagNumber = parseInt(req.body.tagnumber)
        // console.log({ bodyTagNumber, pathTagNumber, body: req.body })
        if (!!pathTagNumber) return pathTagNumber
        if (!!bodyTagNumber) return bodyTagNumber

        return 'current'
    }

    getBikeTagNumberIndexFromImages(images, tagNumber, proof = false) {
        let tagNumberIndex = images.length + 1 - (tagNumber - (tagNumber % 2) + 1) * 2

        const verifyTagNumber = function (index) {
            if (!images[index] || !images[index].description) {
                return false
            }

            let compare = `#${tagNumber} tag`
            if (proof) {
                compare = `#${tagNumber} proof`
            }

            return index > -1 && !!images[index]
                ? images[index].description.indexOf(compare) !== -1
                : false
        }

        if (verifyTagNumber(tagNumberIndex)) {
            return tagNumberIndex
        }
        if (tagNumberIndex < images.length + 1 && verifyTagNumber(tagNumberIndex + 1)) {
            return tagNumberIndex + 1
        }
        if (tagNumberIndex > 0 && verifyTagNumber(tagNumberIndex - 1)) {
            return tagNumberIndex - 1
        }

        for (let i = 0; i < images.length; ++i) {
            if (verifyTagNumber(i)) {
                return i
            }
        }

        return -1
    }

    async getBikeTagPostsFromSubreddit(config, subreddit, opts, callback, uncached = false) {
		if (typeof opts === 'function') {
			callback = opts
			opts = {}
		}

        const cacheKey = `${this.cacheKeys.redditPosts}::${subreddit}::${JSON.stringify(opts)}`
        let getBikeTagPostsFromSubredditResponse = this.cache.get(cacheKey)

        if (!getBikeTagPostsFromSubredditResponse || uncached) {
			const r = new reddit(config.auth)
			const query = `subreddit:${subreddit} title:Bike Tag`
			opts = merge({
				sort: 'new',
				limit: 10,
				time: 'year',
			}, opts)

			await r.getSubreddit(subreddit).search({ query, ...opts, }).then((response) => {
				getBikeTagPostsFromSubredditResponse = response
			})

			this.cache.set(cacheKey, getBikeTagPostsFromSubredditResponse)
		}

		return callback(getBikeTagPostsFromSubredditResponse)
    }

    /// TODO: cache this response
    getBikeTagsByUser(imgurClientID, albumHash, username, callback, uncached = false) {
        const cacheKey = `${this.cacheKeys.bikeTagsByUser}${albumHash}::${username}`
        const getBikeTagsByUserResponse = this.cache.get(cacheKey)

        if (!getBikeTagsByUserResponse || uncached) {
            return this.getBikeTagImages(imgurClientID, albumHash, (images) => {
                if (username) {
                    const usersImages = images.filter((i) => {
                        return i.description.indexOf(username) !== -1
                    })

                    return callback(usersImages)
                } else {
                    const usernames = [],
                        imagesGroupedByUsername = {}
                    const sortedImages = images.sort((a, b) => {
                        const usernameA = this.getBikeTagUsernameFromImage(a)
                        const usernameB = this.getBikeTagUsernameFromImage(b)

                        // record the username
                        if (usernames.indexOf(usernameA) === -1) usernames.push(usernameA)

                        return ('' + usernameA).localeCompare(usernameB)
                    })
                    usernames.forEach((username) => {
                        imagesGroupedByUsername[username] = sortedImages.filter(
                            (i) =>
                                this.getBikeTagUsernameFromImage(i).localeCompare(username) === 0,
                        )
                    })

                    this.cache.set(cacheKey, imagesGroupedByUsername)

                    return callback(imagesGroupedByUsername)
                }
            })
        } else {
            this.log('getting cached getBikeTagInformation', {
                cacheKey,
                getBikeTagInformationResponse: getBikeTagsByUserResponse,
            })
            return callback(getBikeTagsByUserResponse)
        }
    }

    async getBikeTagsFromRedditPosts(posts) {
        let selftext = '',
            postBody,
            isSelfPost = true
        const postTexts = []

        for (let i = 0; i < posts.length; i++) {
            const p = posts[i]

            const imgurBaseUrl = '://imgur.com'
            const galleryBaseUrl = `${imgurBaseUrl}/gallery/`
            const albumBaseUrl = `${imgurBaseUrl}/a/`

            if (p.selftext && p.selftext.length) {
                postBody = selftext = p.selftext
            } else if (p.media && p.media.oembed) {
                /// Might be a single tag?
                postBody = `${p.media.oembed.title} ${p.media.oembed.description}`
                selftext = p.media.oembed.url
                isSelfPost = false
            }

            let tagImageURLs = this.getImageURLsFromText(selftext)
            let tagNumbers = this.getTagNumbersFromText(postBody)
            let hint = this.getHintFromText(postBody)
            let foundAt = this.getFoundLocationFromText(postBody)
            let gps = this.getGPSLocationFromText(postBody)
            let credit = this.getCreditFromText(postBody, `u/${p.author.name}`)

            let directImageLinks = [],
                directImageLinksNumbers = tagNumbers
            for (let u = 0; u < tagImageURLs.length; u++) {
                const imageUrl = tagImageURLs[u]
                const galleryIndex = imageUrl.indexOf(galleryBaseUrl)
                const albumIndex = imageUrl.indexOf(albumBaseUrl)
                const imageUrlIsGallery = galleryIndex !== -1
                const imageUrlIsAlbum = albumIndex !== -1
                const imageIsMultipleIndex = imageUrlIsGallery ? galleryIndex : albumIndex
                const imageIsMultipleLength = imageUrlIsGallery
                    ? galleryBaseUrl.length
                    : albumBaseUrl.length

                /// If the one image is a gallery, we need to go get it's images and parse those
                if (imageUrlIsGallery || imageUrlIsAlbum) {
                    const imgurUrlGetMethod = imageUrlIsGallery
                        ? imgur.getGalleryInfo
                        : imgur.getAlbumInfo
                    const galleryID = imageUrl.substring(
                        imageIsMultipleIndex + imageIsMultipleLength,
                    )
                    const galleryInfoResponse = await imgurUrlGetMethod(galleryID)

                    if (galleryInfoResponse.data) {
                        galleryInfoResponse.data.images.forEach((image) => {
                            const imageText = `${image.title} ${image.description}`
                            const newImageNumbers = this.getTagNumbersFromText(imageText)

                            if (newImageNumbers.length) {
                                directImageLinksNumbers.splice(u, 1)
                                directImageLinksNumbers = directImageLinksNumbers.concat(
                                    newImageNumbers,
                                )
                            }

                            directImageLinks.push(image.link)

                            hint = hint || this.getHintFromText(imageText)
                            foundAt = foundAt || this.getFoundLocationFromText(postBody)
                            credit = credit || this.getCreditFromText(postBody)
                            gps = gps || this.getGPSLocationFromText(postBody)
                        })
                        credit = credit || info.account_url
                    } else {
                        console.log('UH OH', { imageUrl })
                    }
                } else {
                    directImageLinks.push(imageUrl)
                }
            }

            if (!directImageLinksNumbers.length) {
                /// No tag numbers found?
                this.log({ unreadableRedditPost: p })
            } else {
                if (!foundAt) {
                    foundAt = postBody
                    const removeStringFromFoundAt = (s) => (foundAt = foundAt.replace(s, ''))
                    const foundAtRemnantRegex = /\s*at\s*/gi
                    tagImageURLs.forEach(removeStringFromFoundAt)
                    tagNumbers.forEach((s) => removeStringFromFoundAt(`#${s}`))

                    if (credit) removeStringFromFoundAt(`(@|#|u/)?${credit}`)
                    if (gps)
                        removeStringFromFoundAt(
                            new RegExp(
                                `(@|#)?${gps.replace(' ', '.?').replace(',', 's?')}|(@|#)?${gps}`,
                                'gi',
                            ),
                        )
                    if (hint)
                        removeStringFromFoundAt(
                            new RegExp(`(\()?(hint:?)?\s*(${hint})(\s?\))?`, 'gi'),
                        )

                    removeStringFromFoundAt(/\[(?:bike)?\s*tag\s*\d*\]\(\s*\)/gi)
                    removeStringFromFoundAt(/\[\s*\]\(http.*\)/gi)
                    removeStringFromFoundAt(/\[(?!(?:bike)?\s*tag\s*).*\]\(.*\)/gi)
                    removeStringFromFoundAt(/\[(?:bike)?\s*tag\s*\d*\s*-/gi)
                    removeStringFromFoundAt(/\]\(\s*\)/gi)
                    removeStringFromFoundAt(/\r?\n?/gi)
                    removeStringFromFoundAt(/\\/gi)
                    removeStringFromFoundAt(/\(\s*\)/gi)
                    removeStringFromFoundAt(/&#.*;/gi)

                    if (foundAt.endsWith('at') || foundAt.endsWith('at '))
                        removeStringFromFoundAt(foundAtRemnantRegex)
                    if (foundAt.startsWith('-') || foundAt.startsWith(' -'))
                        removeStringFromFoundAt(/^\s*-/i)
                    if (foundAt.startsWith(',') || foundAt.startsWith(' ,'))
                        removeStringFromFoundAt(/^\s*,/i)

                    foundAt = foundAt.trim()
                }

                postTexts.push({
                    id: p.id,
                    isSelfPost,
                    selftext,
                    postBody,
                    tagNumbers: directImageLinksNumbers,
                    tagImageURLs: directImageLinks,
                    credit,
                    gps,
                    foundAt,
                    hint,
                    author_flair: p.author_flair_text,
                })
            }
        }

        return postTexts
    }

    getBikeTagUsernameFromImage(image) {
		return this.getCreditFromText(image.description)
    }

    async postCurrentBikeTagToReddit(config, tagNumberToPost, callback, renderer) {
        /// Support getting the current tag if no number is passed as second param
        if (typeof tagNumberToPost === 'function') {
            renderer = callback
            callback = tagNumberToPost
        }

        /// Otherwise, fetch the most recent image
        tagNumberToPost = tagNumberToPost || config.currentTagInfo.currentTagNumber
        let currentTagInfo = config.currentTagInfo

        /// Support passing an image in instead of the tagNumber
        if (typeof tagNumberToPost === 'object') {
            currentTagInfo = tagNumberToPost
        } else {
            await this.getBikeTagInformation(
                config.imgur.imgurClientID,
                config.currentTagInfo.currentTagNumber,
                config.imgur.albumHash,
                (tagData) => {
                    currentTagInfo = tagData
                },
            )
        }

        /// Make sure we're working with the most up to date image data
        let r = new reddit(config.auth),
            selfPostName,
            crossPostName,
            error

        currentTagInfo.host = config.host

        const renderOpts = merge(currentTagInfo, {
            region: config.region,
            subdomainIcon: config.meta.image,
            host: config.host,
        })

        const currentTagTemplate = renderer('reddit/post', renderOpts)

        /// Create a new BikeTag self post
        await r
            .getSubreddit(config.reddit.subreddit)
            .submitSelfpost({
                title: `Bike Tag #${currentTagInfo.currentTagNumber}`,
                text: currentTagTemplate.replace('<pre>', '').replace('</pre>', ''),
            })
            .assignFlair({
                text: config.reddit.postFlair || 'BikeTag',
            })
            .approve()
            .sticky()
            .distinguish()
            .then((response) => {
                error = response.error
                selfPostName = response.name
            })

        /// this crosspost can't be submitted with a different user
        await r
            .getSubmission(selfPostName)
            .submitCrosspost({
                subredditName: 'biketag',
                title: `[X-Post r/${config.reddit.subreddit}] Bike Tag #${config.currentTagInfo.currentTagNumber} (${config.region})`,
                resubmit: false,
            })
            .then((response) => {
                error = error || response.error
                crossPostName = response.name
            })

        callback({ error, crossPostName, selfPostName })
    }

    async setBikeTagCrossPostFlair(config, callback) {
        const r = new reddit(config.auth)

        await r
            .getSubmission(redditData.name)
            .fetch()
            .then((submission) => {
                if (!!submission) {
                    return r
                        .getSubreddit(config.reddit.subreddit)
                        .assignFlair({
                            text: regionName,
                        })
                        .then(callback)
                        .catch(callback)
                } else {
                    console.error('post to reddit error!')
                }
            })
            .catch(callback)
    }

    async setBikeTagImages(
        imgurClientID,
        imgurAuthorization,
        images,
        albumHash,
        imagesType = 'Url',
        callback,
    ) {
        imgur.setClientId(imgurClientID)
        imgur.setAccessToken(imgurAuthorization.replace('Bearer ', ''))

        const self = this
        const newImages = []
        const updatedTagsInformation = []

        for (let i = 0; i < images.length; i++) {
            const imageInfo = images[i]
			const image = imageInfo.image
			
			/// Put some time between upload here
            await this.getBikeTagInformation(
                imgurClientID,
                imageInfo.currentTagNumber,
                albumHash,
                (existingImage) => {
                    if (existingImage) {
                        const updateImage = {
                            id: existingImage.image.id,
                            title: image.title || existingImage.image.title,
                            description: image.description || existingImage.image.description,
                        }

                        /// Update the image now
                        return imgur
                            .updateInfo(updateImage.id, updateImage.title, updateImage.description)
                            .then((json) => {
                                if (json.success) {
                                    self.log(`image updated (${updateImage.id})`, { json })
                                    updatedTagsInformation.push({
                                        id: updateImage.id,
                                        updated: true,
										proofImage: false,
									})

									console.log({imageInfo, existingImage})
									
									if (existingImage.proofTag && existingImage.proofTag.id) {
										updateImage.id = existingImage.proofTag.id
										updateImage.title = imageInfo.proofTag.title
										updateImage.description = imageInfo.proofTag.description

										// console.log({updateImage, proofTag: imageInfo.proofTag})
										
										return imgur
										.updateInfo(updateImage.id, updateImage.title, updateImage.description)
										.then((json) => {
											if (json.success) {
												self.log(`proof image updated (${updateImage.id})`, { json })
												updatedTagsInformation.push({
													id: updateImage.id,
													updated: true,
													proofImage: true,
												})
											}
										})
									} else {
										newImages.push(imageInfo.proofTag)
									}
                                }
                            })
                    } else {
                        newImages.push(image)
                        newImages.push(imageInfo.proofTag)
                    }
                },
                true,
            )
        }

        /// Create the new images
        if (newImages.length) {
            await imgur.uploadImages(newImages, imagesType, albumHash).then((json) => {
				self.log(`[${newImages.length}] images uploaded to album ${albumHash}`)
				console.log({json})
                callback({ updatedTagsInformation, newTagsInformation: json.reduce((o, i) => {
					o.push({
						id: i.id,
						updated: true,
						proofImage: i.description.indexOf('proof') !== -1,
					})

					return o
				}, []) })
            })
        } else {
            self.log(`no new images to upload`)
            callback({ updatedTagsInformation, newTagsInformation: null })
        }
    }

    async setBikeTagPostFlair(config, tagNumberToUpdate, flair, callback) {
        /// Support setting the current tag if no number is passed as second param
        if (typeof flair === 'function') {
            callback = flair
            flair = tagNumberToUpdate
        }

        /// Otherwise, fetch the most recent image
        tagNumberToUpdate = tagNumberToUpdate || config.currentTagInfo.currentTagNumber
        let redditPostName

        /// Support passing an object with the selfPostName in instead of the tagNumber
        if (typeof tagNumberToUpdate === 'object' && tagNumberToUpdate.selfPostName) {
            redditPostName = tagNumberToUpdate.selfPostName
        } else if (!config.currentTagInfo && tagNumberToUpdate.description) {
            config.currentTagInfo = { image: tagNumberToUpdate }
        } else if (!config.currentTagInfo) {
            await this.getBikeTagInformation(
                config.imgur.imgurClientID,
                config.currentTagInfo.currentTagNumber,
                config.imgur.albumHash,
                (tagData) => {
                    config.currentTagInfo = tagData
                },
            )
        }

        /// If the redditPostName was not passed in, parse it from the current image's description
        if (!redditPostName) {
            const searchRedditUrlPrefix = '://redd.it/'
            const redditUrlIndex = config.currentTagInfo.image.description.indexOf(
                searchRedditUrlPrefix,
            )

            /// If the reddit url doesn't exist in the image we can't udpate anything
            if (redditUrlIndex === -1) return callback(null)

            redditPostName = `t3_${config.currentTagInfo.image.description.substring(
                redditUrlIndex + searchRedditUrlPrefix.length,
            )}`
        }

        let r = new reddit(config.auth)

        return r
            .getSubmission(redditPostName)
            .assignFlair({
                text: flair ? flair : config.reddit.postFlair || 'BikeTag',
            })
            .then(callback)
    }

    /// API passthroughs
    getImgurAlbumInfo(imgurClientID, albumHash, callback) {
        imgur.setClientId(imgurClientID)

        return imgur.getAlbumInfo(albumHash).then((json) => {
            return callback(json.data)
        })
    }

    updateImgurInfo(imgurAuthorization, image, callback) {
        imgur.setAccessToken(imgurAuthorization.replace('Bearer ', ''))

        return imgur.updateInfo(image.id, image.title, image.description).then((json) => {
            return callback(json.data)
        })
    }

    /// OTHER METHODS
    flushCache() {
        this.log('Flushing the cache')
        return this.cache.flushAll()
    }

    getImagesByBikeTagNumber(images) {
        return images.sort((image1, image2) => {
            const tagNumber1 = this.getBikeTagNumberFromImage(image1)
            const tagNumber2 = this.getBikeTagNumberFromImage(image2)

            const tagNumber1IsProof = tagNumber1 < 0
            const difference = Math.abs(tagNumber2) - Math.abs(tagNumber1)
            const sortResult = difference !== 0 ? difference : tagNumber1IsProof ? -1 : 1

            return sortResult
        })
    }

    getImagesByUploadDate(images, newestFirst) {
        if (!newestFirst) {
            return images.sort(
                (image1, image2) => new Date(image2.datetime) - new Date(image1.datetime),
            )
        }
        return images.sort(
            (image1, image2) => new Date(image1.datetime) - new Date(image2.datetime),
        )
    }

    getTagNumbersFromText(inputText, fallback) {
		/// TODO: build out testers for all current games of BikeTag on Reddit
        const getTagNumbersRegex = new RegExp(
            /((?:(?:bike\s*)?(?:\s*tag)?)#(\d+)(?:(?:\s*tag)?|(?:\s*proof)?))|(?:\[(?:\s*bike\s*)(?:\s*tag\s*))#?(\d+)(?:(?:\])|(?:\s*.\s*.*\]))/gi,
        )
        const tagNumberText = inputText.match(getTagNumbersRegex)
        if (!tagNumberText) return fallback || []

        const tagNumbers = tagNumberText.reduce((numbers, text) => {
            let tagNumber = text.match(/\d+/)
            tagNumber = tagNumber && tagNumber.length ? tagNumber[0] : null

            if (!tagNumber) return numbers

            const number = Number.parseInt(tagNumber)
            if (numbers.indexOf(number) == -1) numbers.push(number)

            return numbers
        }, [])

        if (!tagNumbers.length && fallback) return fallback

        return tagNumbers
    }

    getCreditFromText(inputText, fallback) {
        /// TODO: build out testers for all current games of BikeTag on Reddit
        const creditRegex = new RegExp(
            /((?:\[.*)(?:tag by\s*)(.+?)(?:\]))|((?:credit goes to:\s*)(.+?)(?:for))/gi,
        )
        const creditText = creditRegex.exec(inputText)
        if (!creditText) return fallback || null

        const tagCredits = creditText.filter((c) =>
            typeof c === 'string' && c.indexOf(' ') === -1 ? c : undefined,
        )

        if (!tagCredits.length && fallback) return fallback

        /// Return just one credit
        /// There should only be one anyways
        return tagCredits[0]
    }

    getFoundLocationFromText(inputText, fallback) {
        /// TODO: build out testers for all current games of BikeTag on Reddit
        const getFoundLocationRegex = new RegExp(
            /(?:found at \()(.+?)(?:\))|(?:\[(?:\s*bike\s*)(?:\s*tag\s*))#?(\d+)(?:(?:\])|(?:\s*.\s*(.*)\]))/gi,
        )
        const foundLocationText = getFoundLocationRegex.exec(inputText)

        if (!foundLocationText) return fallback || null
        return (foundLocationText[1] || '').trim()
    }

    getHintFromText(inputText, fallback) {
        /// TODO: build out testers for all current games of BikeTag on Reddit
        const getTagNumbersRegex = new RegExp(/(?:hint:\s*)/gi)
        const tagNumberText = inputText.match(getTagNumbersRegex)
        if (!tagNumberText) return fallback || null

        const tagNumbers = tagNumberText.reduce((numbers, text) => {
            let tagNumber = text.match(/\d+/)
            tagNumber = tagNumber && tagNumber.length ? tagNumber[0] : null

            if (!tagNumber) return numbers

            const number = Number.parseInt(tagNumber)
            if (numbers.indexOf(number) == -1) numbers.push(number)

            return numbers
        }, [])

        if (!tagNumbers.length && fallback) fallback

        return tagNumbers
    }

    getGPSLocationFromText(inputText, fallback) {
        /// TODO: build out testers for all current games of BikeTag on Reddit
        const getGPSLocationRegex = new RegExp(
            /(([0-9]{1,2})[:|°]([0-9]{1,2})[:|'|′]?([0-9]{1,2}(?:\.[0-9]+){0,1})?["|″]([N|S]),?\s*([0-9]{1,3})[:|°]([0-9]{1,2})[:|'|′]?([0-9]{1,2}(?:\.[0-9]+){0,1})?["|″]([E|W]))|((-?\d+(\.\d+)?),\s*(-?\d+(\.\d+)?))/g,
        )
        /// Normalize the text (some posts found to have this escaped double quote placed in between GPS coordinates)
        inputText = inputText.replace(/\\/g, '')
        const gpsLocationText = getGPSLocationRegex.exec(inputText)

        if (!gpsLocationText) return fallback || null

        return gpsLocationText[0] || null
    }

    getImageURLsFromText(inputText, fallback) {
        /// TODO: make this image validator more intelligent
        const validImageURLs = ['imgur']

        const selfTextURLs = inputText.match(/\b(https?:\/\/.*?\.[a-z]{2,4}\/[^\s)]*\b)/gi) || []
        const tagImageURLs = selfTextURLs.reduce((urls, url) => {
            if (!url || !new RegExp(validImageURLs.join('|')).test(url)) return urls

            urls.push(url)

            return urls
        }, [])

        if (!tagImageURLs.length && fallback) fallback

        return tagImageURLs
    }

    setCache(cache, cacheKeys) {
        this.cache = cache
        this.cacheKeys = !!cacheKeys ? cacheKeys : this.cacheKeys

        // const setCache = this.cache.set
        // this.cache.set = (key, val) => {
        // 	console.log({key, setting: val})
        // 	return setCache(key, val)
        // }
    }

    setLogger(logger) {
        this.log = logger
    }
}

class BikeTagApiFactory {
    constructor() {
        /// If we already have an instance, return it
        if (singleton) return singleton.instance

        // create a unique, global symbol namespace
        // -----------------------------------
        const globalNamespace = Symbol.for(namespace)

        // check if the global object has this symbol
        // add it if it does not have the symbol, yet
        // ------------------------------------------
        var globalSymbols = Object.getOwnPropertySymbols(global)
        var utilInitialized = globalSymbols.indexOf(globalNamespace) > -1

        /// This should always be unitialized, probably
        if (!utilInitialized) {
            global[globalNamespace] = new BikeTagApi()

            // define the singleton API
            // ------------------------
            singleton = {}

            Object.defineProperty(singleton, 'instance', {
                get: function () {
                    return global[globalNamespace]
                },
            })

            // ensure the API is never changed
            // -------------------------------
            Object.freeze(singleton)
        }

        // export the singleton API only
        // -----------------------------
        return singleton.instance
    }
}

module.exports = new BikeTagApiFactory()
module.exports.namespace = namespace
