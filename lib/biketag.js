const imgur = require('imgur')
const reddit = require('snoowrap')
const nodeCache = require('node-cache')
const { extname } = require('path')
const merge = require('deepmerge')

class BikeTagApi {
    /// TODO: add jsdocs here and tie this class to the controller in controllers/api/index using res.locals
    constructor(logger = (m) => m, cache) {
        const cacheOptions = {
            stdTTL: 600,
            checkperiod: 450,
        }
        this.cacheKeys = {
            albumHash: `imgur::`,
            bikeTagImage: `biketag::`,
            bikeTagsByUser: `usertags::`,
        }
        this.setLogger(logger)
        this.setCache(cache || new nodeCache(cacheOptions, this.cacheKeys))

        this.log(`BikeTag Cache Configured`, cache)
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

    flushCache() {
        this.log('Flushing the cache')
        return this.cache.flushAll()
    }

    getImgurAlbumInfo(imgurClientID, albumHash, callback) {
        imgur.setClientId(imgurClientID)

        return imgur.getAlbumInfo(albumHash).then((json) => {
            return callback(json.data)
        })
    }

    /// TODO: cache this response
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

    getBikeTagImages(imgurClientID, albumHash, callback, uncached = false) {
        const cacheKey = `${this.cacheKeys.albumHash}${imgurClientID}::${albumHash}`
        const getBikeTagImagesResponse = this.cache.get(cacheKey)

        if (!getBikeTagImagesResponse || uncached) {
            return this.getImgurAlbumInfo(imgurClientID, albumHash, (data) => {
                const images = this.getImagesByTagNumber(data.images)
                this.cache.set(cacheKey, images)

                this.log('got new getBikeTagImages', { cacheKey, image: { images } })
                return callback(images)
            }).catch((e) => console.log('ERROR: getBikeTagImages:', { e }))
        } else {
            this.log('getting cached getBikeTagImages', { cacheKey, getBikeTagImagesResponse })
            return callback(getBikeTagImagesResponse)
        }
    }

    getTagNumberFromRequest(req) {
        const pathTagNumber = parseInt(req.params.tagnumber)
        const bodyTagNumber = parseInt(req.body.tagnumber)
        // console.log({ bodyTagNumber, pathTagNumber, body: req.body })
        if (!!pathTagNumber) return pathTagNumber
        if (!!bodyTagNumber) return bodyTagNumber

        return 'current'
    }

    getTagInformation(imgurClientID, tagNumberRequested, albumHash, callback, uncached = false) {
        const cacheKey = `${this.cacheKeys.bikeTagImage}${albumHash}::${tagNumberRequested}`
        const getTagInformationResponse = this.cache.get(cacheKey)

        if (!getTagInformationResponse || uncached) {
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

                        const currentTagIndex = this.getTagNumberIndex(images, mysteryTagNumber)
                        const proofTagIndex = this.getTagNumberIndex(images, proofTagNumber, true)
                        const previousMysterTagIndex = this.getTagNumberIndex(
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

                        // if (!uncached)
                        this.cache.set(cacheKey, tagData)
                        this.log('got new getTagInformation', { cacheKey, tagData })

                        return callback(tagData)
                    }

                    return callback(null)
                },
                uncached,
            )
        } else {
            this.log('getting cached getTagInformation', { cacheKey, getTagInformationResponse })
            return callback(getTagInformationResponse)
        }
    }

    setTagImageInformation(imgurClientID, image, callback) {
        imgur.setClientId(imgurClientID)

        return imgur.updateInfo(image.id, image.title, image.description).then((json) => {
            return callback(json.data)
        })
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
            await this.getTagInformation(
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
            await this.getTagInformation(
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

    getBikeTagNumberFromImage(image) {
        let tagNumber

        if (image.description) {
            const split = image.description.split(' ')
            tagNumber = Number.parseInt(split[0].substring(1))

            if (image.description.indexOf('proof') !== -1) {
                tagNumber = 0 - tagNumber
            }
        }

        return tagNumber
    }

    getBikeTagUsernameFromImage(image) {
        let username

        if (image.description) {
            const split =
                image.description.indexOf('by') !== -1
                    ? image.description.split('by')
                    : image.description.split('for')
            username = split[split.length - 1].substring(1)
            /// normalize
            username = username.replace('"', '')
        }

        return username
    }

    getImagesByTagNumber(images) {
        return images.sort((image1, image2) => {
            const tagNumber1 = this.getBikeTagNumberFromImage(image1)
            const tagNumber2 = this.getBikeTagNumberFromImage(image2)

            const tagNumber1IsProof = tagNumber1 < 0
            const difference = Math.abs(tagNumber2) - Math.abs(tagNumber1)
            const sortResult = difference !== 0 ? difference : tagNumber1IsProof ? -1 : 1

            return sortResult
        })
    }

    getTagNumberIndex(images, tagNumber, proof = false) {
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

    /// TODO: cache this response
    getUsernameFromTag(tagnumber = 'current') {
        if (typeof tagnumber === 'string') {
            return this.getTagInformation(imgurClientID, tagnumber, albumHash, () => {})
        } else {
            return this.getUsernameFromTag(tagnumber)
        }
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
            this.log('getting cached getTagInformation', {
                cacheKey,
                getTagInformationResponse: getBikeTagsByUserResponse,
            })
            return callback(getBikeTagsByUserResponse)
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
}

module.exports = new BikeTagApi()
