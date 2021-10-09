/**
 * Module dependencies.
 */
const biketag = require('../../lib/biketag')
const util = require('../../lib/util')
const got = require('got')
class bikeTagController {
    postToReddit(req, res) {
        const { subdomain, host } = res.locals
        const subdomainConfig = this.app.getSubdomainOpts(subdomain)

        if (!subdomainConfig.reddit.autoPost) {
            return res.json({
                error: `Subdomain is not configured to support autoposting to Reddit, please contact support@biketag.org for help turning this feature on.`,
                subdomain,
            })
        }

        const expiryHash = util.getFromQueryOrPathOrBody(req, 'expiry')
        const decodedExpiryHash = decodeURIComponent(expiryHash)
        const expiry = this.app.crypto().decrypt(decodedExpiryHash)
        const expiryHashTime = expiry ? new Date(expiry.expiry).getTime() : null
        const currentTime = new Date().getTime()
        const validExpiry = !!expiry && !(currentTime > expiryHashTime || subdomain !== expiry.subdomain)

        /// Check the expiry, if no match then don't allow this post
        if (!validExpiry) {
            if (expiry !== null) {
                return res.json({
                    error: `Link expired. Check <a href="https://reddit.com/r/${subdomainConfig.reddit.subreddit}">r/${subdomainConfig.reddit.subreddit}</a> to see if it's already been posted?`,
                    expiry,
                })
            } else {
                return res.json({ error: 'cannot validate link' })
            }

            /// It's a valid expiry
        }

        console.log({ expiry, validExpiry })

        subdomainConfig.requestSubdomain = subdomain
        subdomainConfig.host = host
        subdomainConfig.viewsFolder = this.app.config.viewsFolder
        subdomainConfig.version = this.app.config.version
        subdomainConfig.auth = this.app.authTokens[subdomain].redditBot ?
            {...this.app.authTokens[subdomain].redditBot.opts } :
            {...subdomainConfig.reddit }
        subdomainConfig.auth.clientId = subdomainConfig.auth.clientID
        subdomainConfig.imgur = this.app.middlewares.util.merge(
            subdomainConfig.imgur,
            this.app.authTokens[subdomain].imgur,
        )

        let redditSelfPostName
        const { albumHash, imgurClientID, imgurAccessToken } = subdomainConfig.imgur
        return biketag
            .getBikeTagInformation(
                imgurClientID,
                expiry.tagnumber,
                albumHash,
                async(currentTagInfo) => {
                    // check to see if reddit link already exists, if so then skip posting it
                    if (
                        currentTagInfo.discussionLink &&
                        currentTagInfo.discussionLink.indexOf('https://redd.it/') !== -1
                    ) {
                        return res.json({
                            success: 'tag has already been posted to Reddit',
                            url: currentTagInfo.discussionLink,
                        })
                    }

                    subdomainConfig.currentTagInfo = currentTagInfo

                    const selfPostCallback = async(response) => {
                        if (!response.error && response.selfPostName) {
                            this.app.log.status('posted to reddit', response)
                            redditSelfPostName = response.selfPostName

                            if (response.crossPostName) {
                                const globalRedditAccount =
                                    this.app.config.authentication.reddit || subdomainConfig.reddit
                                const regionName = `${subdomain
									 .charAt(0)
									 .toUpperCase()}${subdomain.slice(1)}`
                                const postFlair = subdomainConfig.reddit.globalPostFlair ?
                                    subdomainConfig.reddit.globalPostFlair :
                                    regionName
                                subdomainConfig.auth.username = globalRedditAccount.username
                                subdomainConfig.auth.password = globalRedditAccount.password

                                /// TODO: unsticky previous BikeTag post

                                await biketag
                                    .setBikeTagPostFlair(
                                        subdomainConfig, { selfPostName: response.crossPostName },
                                        postFlair,
                                        (response) => {
                                            this.app.log.status('setBikeTagPostFlair', response)
                                        },
                                    )
                                    .catch((error) => {
                                        this.app.log.error(`setBikeTagPostFlair failed`, error)
                                    })
                            }

                            const discussionUrl = ` https://redd.it/${response.selfPostName.replace(
								 't3_',
								 '',
							 )}`
                            const updatedImage = {
                                id: subdomainConfig.currentTagInfo.image.id,
                                title: `${subdomainConfig.currentTagInfo.image.title} {${discussionUrl}}`,
                                description: subdomainConfig.currentTagInfo.image.description,
                            }

                            await biketag
                                .updateImgurInfo(imgurAccessToken, updatedImage, (response) => {
                                    this.app.log.status('updateImgurInfo', response, updatedImage)
                                })
                                .catch((error) => {
                                    this.app.log.error(`updateImgurInfo failed`, {
                                        error,
                                        updatedImage,
                                    })
                                })

                            return res.json({ success: response, url: discussionUrl })
                        }

                        return res.json({ error: response })
                    }

                    const liveThreadCommentCallback = async(response) => {
                        console.log('liveThreadCommentCallback', { response })
                        if (!response.error && response.selfPostName) {
                            this.app.log.status('posted comment to reddit live thread', {
                                liveThread: subdomainConfig.reddit.liveThread,
                                response,
                            })
                            const redditT3ID = redditSelfPostName ? redditSelfPostName : response.id
							const discussionUrl = redditT3ID && redditT3ID.length ?
							` https://redd.it/${redditT3ID.replace('t3_', '')}` : null
                            
							if (discussionUrl) {   
                                const updatedImage = {
                                    id: subdomainConfig.currentTagInfo.image.id,
                                    title: `${subdomainConfig.currentTagInfo.image.title} {${discussionUrl}}`,
                                    description: subdomainConfig.currentTagInfo.image.description,
                                }

                                await biketag
                                    .updateImgurInfo(imgurAccessToken, updatedImage, (response) => {
                                        this.app.log.status(
                                            'updateImgurInfo',
                                            response,
                                            updatedImage,
                                        )
                                    })
                                    .catch((error) => {
                                        this.app.log.error(`updateImgurInfo failed`, {
                                            error,
                                            updatedImage,
                                        })
                                    })
                            }

                            return res.json({ success: response, url: discussionUrl })
                        }
                    }

                    let redditAutoPostMethod = biketag.postCurrentBikeTagToRedditSelfPost.bind(
                            biketag,
                        ),
                        redditAutoPostCallback = selfPostCallback.bind(this)

                    if (subdomainConfig.reddit.disableSelfPost) {
                        redditAutoPostMethod = subdomainConfig.reddit.liveThread ?
                            biketag.postCurrentBikeTagToRedditLiveThread.bind(biketag) :
                            () => {
                                res.json({ error: 'autoposting disabled' })
                            }
                        redditAutoPostCallback = liveThreadCommentCallback.bind(this)
                    } else if (
                        subdomainConfig.reddit.liveThread &&
                        subdomainConfig.reddit.autoPostToliveThread
                    ) {
                        /// Create the self post first
                        await redditAutoPostMethod(
                            subdomainConfig,
                            redditAutoPostCallback,
                            this.app.renderSync.bind(this.app),
                        )

                        subdomainConfig.redditSelfPostName = redditSelfPostName
                        redditAutoPostMethod = biketag.postCurrentBikeTagToRedditLiveThread.bind(
                            biketag,
                        )
                        redditAutoPostCallback = liveThreadCommentCallback.bind(this)
                    }

                    return redditAutoPostMethod(
                        subdomainConfig,
                        redditAutoPostCallback,
                        this.app.renderSync.bind(this.app),
                    )
                },
                true,
            )
            .catch((e) => {
                this.app.log.error({ redditApiError: e })

                return res.json({ error: e.message })
            })
    }

    getExpiryFromHash(expiryHash, subdomain) {
        const expiry = expiryHash ? this.app.crypto().decrypt(decodeURIComponent(expiryHash)) : null
        if (!expiry) {
            return null
        }

        const expiryHashTime = new Date(expiry.expiry).getTime()
        if (new Date().getTime() > expiryHashTime || subdomain !== expiry.subdomain) {
            return false
        }

        return expiry
    }

    getNewExpiryHash(data) {
        const expiry = new Date(
            /// Expiry is now plus  Ms     s    h    days  x (default 2)
            new Date().getTime() +
            1000 * 60 * 60 * 24 * (this.app.config.expiryDays ? this.app.config.expiryDays : 2),
        )
        const emailSecurityHashData = {
            ...data,
            expiry,
        }
        return encodeURIComponent(this.app.crypto().encrypt(emailSecurityHashData))
    }

    async sendEmailToAdministrators(req, res) {
            try {
                const { subdomain, host } = res.locals
                const tagnumber = biketag.getBikeTagNumberFromRequest(req) || 'current'
                const subdomainConfig = this.app.getSubdomainOpts(subdomain)
                const { albumHash, imgurClientID } = subdomainConfig.imgur
                const expiryData = {
                    subdomain,
                    tagnumber,
                    emails: subdomainConfig.adminEmailAddresses,
                    expiry: new Date(
                        /// Expiry is now plus  Ms     s    h    days  x (default 2)
                        new Date().getTime() +
                        1000 *
                        60 *
                        60 *
                        24 *
                        (this.app.config.expiryDays ? this.app.config.expiryDays : 2),
                    ),
                }
                const expiryHash = encodeURIComponent(this.app.crypto().encrypt(expiryData))
                console.log({ expiryHash, expiryData })

                /// Wait for the data to hit reddit
                const getBikeTagInformationSleep = 10000
                this.app.log.status(
                    `waiting for ${getBikeTagInformationSleep}ms until getting new tag information for recent post`, { expiryHash },
                )

                res.json({ wait: getBikeTagInformationSleep })

                const tryGettingLatest = async(attempt = 1) => {
                        await biketag.flushCache()
                        await util.sleep(getBikeTagInformationSleep)

                        return biketag.getBikeTagInformation(
                                imgurClientID,
                                tagnumber,
                                albumHash,
                                (currentTagInfo) => {
                                    if (!currentTagInfo) {
                                        this.app.log.error('how did this happen??', {
                                            albumHash,
                                            tagnumber,
                                            currentTagInfo,
                                        })

                                        if (attempt <= 3) {
                                            this.app.log.status(
                                                'making another attempt to get latest tag information',
                                            )
                                            tryGettingLatest(attempt++)
                                        }

                                        return
                                    }
                                    const currentTagNumber = (subdomainConfig.currentTagNumber =
                                        currentTagInfo.currentTagNumber)
                                    const subject = this.app.renderSync('mail/newBikeTagSubject', {
                                        currentTagNumber,
                                        subdomain,
                                    })
                                    const renderOpts = {
                                            ambassadorsUrl: this.app.getBaseUrl(
                                                undefined,
                                                undefined,
                                                'ambassadors',
                                            ),
                                            subdomain,
                                            region: subdomainConfig.region,
                                            subdomainIcon: subdomainConfig.images.logo ?
                                                `/public/img/${subdomainConfig.images.logo}${
									   subdomainConfig.images.logo.indexOf('.') === -1
										   ? `-small.png`
										   : ''
								   }`
								 : subdomainConfig.meta.image,
							 host: `${
								 subdomainConfig.requestSubdomain
									 ? `${subdomainConfig.requestSubdomain}.`
									 : ''
							 }${subdomainConfig.requestHost || host}`,
							 currentTagInfo,
							 expiryHash,
							 reddit: subdomainConfig.reddit.subreddit,
						 }
 
						 const newBikeTagHtmlTemplate = subdomainConfig.reddit?.autoPost
							 ? 'mail/newBikeTagReddit'
							 : 'mail/newBikeTag'
						 const text = this.app.renderSync('mail/newBikeTagText', renderOpts)
						 const html = this.app.renderSync(newBikeTagHtmlTemplate, renderOpts)
 
						 const emailPromises = []
						 const emailResponses = []
 
						 subdomainConfig.adminEmailAddresses.forEach((emailAddress) => {
							 emailPromises.push(
								 this.app.sendEmail(subdomainConfig, {
									 to: emailAddress,
									 subject,
									 text,
									 callback: (info) => {
										 this.app.log.status(`email sent to ${emailAddress}`, info)
										 emailResponses.push(info.response)
									 },
									 html,
								 }),
							 )
						 })
						 // Promise.all(emailPromises).then(() => {
						 //     return res.json({
						 //         currentTagInfo,
						 //         emailResponses,
						 //     })
						 // })
					 },
					 true,
				 )
			 }
 
			 return tryGettingLatest()
		 } catch (error) {
			 this.app.log.error('email api error', {
				 error,
			 })
			 return res.json({
				 error,
			 })
		 }
	 }
 
	 readFromReddit(req, res) {
		 const { host } = res.locals
		 let subdomain = 'index'
		 const subreddit = util.getFromQueryOrPathOrBody(req, 'subreddit')
 
		 const translateData = util.getFromQueryOrPathOrBody(req, 'translated', false)
		 const rawData = util.getFromQueryOrPathOrBody(req, 'raw', false)
		 const limit = util.getFromQueryOrPathOrBody(req, 'limit', 10, Number.parseInt)
		 const sort = util.getFromQueryOrPathOrBody(req, 'sort', 'new')
 
		 for (const [s, c] of Object.entries(this.app.config.subdomains)) {
			 if (c.reddit && c.reddit.subreddit && c.reddit.subreddit === subreddit) {
				 subdomain = s
				 continue
			 }
		 }
		 const subdomainConfig = this.app.getSubdomainOpts(subdomain)
		 const redditOpts = { sort }
 
		 subdomainConfig.host = host
		 subdomainConfig.version = this.app.config.version
		 subdomainConfig.auth = { ...this.app.authTokens.default.redditBot }
		 subdomainConfig.auth.clientId = subdomainConfig.auth.clientID
 
		 /// Max limit is 100
		 if (limit) redditOpts.limit = limit > 100 ? 100 : limit
 
		 return biketag.getBikeTagPostsFromSubreddit(
			 subdomainConfig,
			 subreddit,
			 redditOpts,
			 async (posts) => {
				 if (!posts || posts.error) {
					 return res.json({ error: posts.error })
				 }
				 const bikeTagPosts = await biketag.getBikeTagsFromRedditPosts(posts)
				 const out = {}
 
				 if (translateData) {
					 subdomainConfig.auth = { ...this.app.authTokens[subdomain] }
					 const bikeTagImagesData = []
					 for (let i = 0; i < bikeTagPosts.length; i++) {
						 const post = bikeTagPosts[i]
						 const bikeTagInformation = await biketag.getBikeTagInformationFromRedditData(
							 post,
							 subdomainConfig,
						 )
						 bikeTagImagesData.push(bikeTagInformation)
					 }
					 out.bikeTagImagesData
					 return res.json({ bikeTagImagesData })
				 } else {
					 out.bikeTagPosts = bikeTagPosts
				 }
 
				 if (rawData) {
					 out.redditPosts = posts
				 }
				 return res.json(out)
			 },
		 )
	 }
 
	 getRedditPost(req, res) {
		 const { subdomain, host } = res.locals
		 const tagnumber = biketag.getBikeTagNumberFromRequest(req)
		 const subdomainConfig = this.app.getSubdomainOpts(subdomain)
		 const { albumHash, imgurClientID } = subdomainConfig.imgur
 
		 this.app.log.status(`reddit endpoint request for tag #${tagnumber}`)
 
		 return biketag.getBikeTagInformation(imgurClientID, tagnumber, albumHash, (data) => {
			 data = data || {
				 error: {
					 message: 'tagnumber: Not Found',
					 tagnumber,
				 },
			 }
			 data.host = host
			 data.region = subdomainConfig.region
 
			 return res.json(data)
		 })
	 }
 
	 updateBikeTagGameFromReddit(req, res) {
		 const { host } = res.locals
		 const subreddit = util.getFromQueryOrPathOrBody(req, 'subreddit')
		 const rawData = util.getFromQueryOrPathOrBody(req, 'raw', false)
		 const limit = util.getFromQueryOrPathOrBody(req, 'limit', 10, Number.parseInt)
		 const sort = util.getFromQueryOrPathOrBody(req, 'sort', 'new')
 
		 let subdomain
 
		 for (const [s, c] of Object.entries(this.app.config.subdomains)) {
			 if (c.reddit && c.reddit.subreddit && c.reddit.subreddit === subreddit) {
				 subdomain = s
				 continue
			 }
		 }
 
		 if (!subdomain) {
			 return res.json({
				 error: `unsupported subreddit, cannot match subdomain or region to the provided subreddit. Try a read/reddit instead.`,
			 })
		 }
		 const subdomainConfig = this.app.getSubdomainOpts(subdomain)
 
		 subdomainConfig.host = host
		 subdomainConfig.version = this.app.config.version
		 subdomainConfig.auth = { ...this.app.authTokens.default.redditBot }
		 subdomainConfig.auth.clientId = subdomainConfig.auth.clientID
 
		 const redditOpts = { sort, limit }
 
		 return biketag.getBikeTagPostsFromSubreddit(
			 subdomainConfig,
			 subreddit,
			 redditOpts,
			 async (posts) => {
				 if (!posts || posts.error) {
					 return res.json({ error: posts.error })
				 }
 
				 const bikeTagPosts = await biketag.getBikeTagsFromRedditPosts(posts)
				 const bikeTagImagesData = []
				 subdomainConfig.auth = { ...this.app.authTokens[subdomain] }
				 for (let i = 0; i < bikeTagPosts.length; i++) {
					 const post = bikeTagPosts[i]
					 const bikeTagInformation = await biketag.getBikeTagInformationFromRedditData(
						 post,
						 subdomainConfig,
					 )
					 bikeTagImagesData.push(bikeTagInformation)
				 }
 
				 const imgurOpts = this.app.middlewares.util.merge(
					 subdomainConfig.imgur,
					 this.app.authTokens[subdomain].imgur,
				 )
				 return biketag.setBikeTagImages(
					 imgurOpts.opts.clientID,
					 imgurOpts.authorization || imgurOpts.opts.authorization,
					 bikeTagImagesData,
					 subdomainConfig.imgur.albumHash,
					 'Url',
					 (results) => {
						 const out = { results }
 
						 if (rawData) {
							 out.bikeTagImagesData = bikeTagImagesData
						 }
 
						 return res.json(out)
					 },
				 )
			 },
		 )
	 }
 
	 getBikeTag(req, res) {
		 const { subdomain, host } = res.locals
		 const tagnumber = biketag.getBikeTagNumberFromRequest(req)
		 const count = lib.getFromQueryOrPathOrBody(req, 'count', 1)
 
		 if (count > 1) {
			 return getBikeTags(req, res, true)
		 }
 
		 /// TODO: put this into sexpress
		 const subdomainIsApi = subdomain === 'api'
		 const requestSubdomain = subdomainIsApi
			 ? req.path.match(/^\/[^\/]+/)[0].substr(1)
			 : subdomain
 
		 const subdomainConfig = this.app.getSubdomainOpts(requestSubdomain)
		 const { albumHash, imgurClientID } = subdomainConfig.imgur
 
		 this.app.log.status(`reddit endpoint request for tag #${tagnumber}`)
 
		 return biketag.getBikeTagInformation(imgurClientID, tagnumber, albumHash, (data) => {
			 data.host = host
			 data.region = subdomainConfig.region
 
			 return res.json(data)
		 })
	 }
 
	 getBikeTags(req, res, fromCurrentTag = false) {
		 const { subdomain, host } = res.locals
		 const tagnumber = biketag.getBikeTagNumberFromRequest(req)
		 const count = lib.getFromQueryOrPathOrBody(req, 'count', 1)
 
		 if (count === 1) {
			 return this.getBikeTag(req, res)
		 }
 
		 /// TODO: put this into sexpress
		 const subdomainIsApi = subdomain === 'api'
		 const requestSubdomain = subdomainIsApi
			 ? req.path.match(/^\/[^\/]+/)[0].substr(1)
			 : subdomain
 
		 const subdomainConfig = this.app.getSubdomainOpts(requestSubdomain)
		 const { albumHash, imgurClientID } = subdomainConfig.imgur
 
		 this.app.log.status(`reddit endpoint request for tag #${tagnumber}`)
		 /// TODO: get all of the biketag images and return the amount requested
 
		 return biketag.getBikeTagImages(imgurClientID, albumHash, (bikeTags) => {
			 if (!fromCurrentTag) {
				 bikeTags = bikeTags.sort()
			 }
 
			 const bikeTagsToReturn = bikeTags.splice(0, count)
		 })
	 }
 
	 getBikeTagFromSanity(req, res) {
		 const { subdomain, host } = res.locals
		 const tagnumber = biketag.getBikeTagNumberFromRequest(req)
		 const count = lib.getFromQueryOrPathOrBody(req, 'count', 1)
 
		 if (count > 1) {
			 return getBikeTagsFromSanity(req, res)
		 }
 
		 /// TODO: put this into sexpress
		 const subdomainIsApi = subdomain === 'api'
		 const requestSubdomain = subdomainIsApi
			 ? req.path.match(/^\/[^\/]+/)[0].substr(1)
			 : subdomain
 
		 const subdomainConfig = this.app.getSubdomainOpts(requestSubdomain)
 
		 this.app.log.status(`biketag endpoint request for tag #${tagnumber}`)
 
		 return biketag
			 .getBikeTagFromSanity(subdomainConfig.sanity, tagnumber, subdomainConfig.region)
			 .then((data) => {
				 data.host = host
				 data.game = data.region = subdomainConfig.region
 
				 return res.json(data)
			 })
	 }
 
	 getBikeTagsFromSanity(req, res) {
		 const { subdomain, host } = res.locals
		 const count = lib.getFromQueryOrPathOrBody(req, 'count', 1)
 
		 if (count === 1) {
			 return this.getBikeTagFromSanity(req, res)
		 }
 
		 /// TODO: put this into sexpress
		 const subdomainIsApi = subdomain === 'api'
		 const requestSubdomain = subdomainIsApi
			 ? req.path.match(/^\/[^\/]+/)[0].substr(1)
			 : subdomain
 
		 const subdomainConfig = this.app.getSubdomainOpts(requestSubdomain)
 
		 this.app.log.status(`biketag endpoint request for all tags`)
		 /// TODO: get all of the biketag images and return the amount requested
 
		 return biketag
			 .getBikeTagsFromSanity(subdomainConfig.sanity, subdomainConfig.region)
			 .then((biketags) => {
				 res.json({
					 biketags,
					 host,
					 subdomain,
					 game: subdomainConfig.region,
				 })
			 })
	 }
 
	 getBikeTagImage(req, res, getProof = false) {
		 const { subdomain } = res.locals
		 const tagnumber = biketag.getBikeTagNumberFromRequest(req)
		 /// TODO: put this into sexpress
		 const subdomainIsApi = subdomain === 'api'
		 const requestSubdomain = subdomainIsApi
			 ? req.path.match(/^\/[^\/]+/)[0].substr(1)
			 : subdomain
 
		 const subdomainConfig = this.app.getSubdomainOpts(requestSubdomain)
		 const { albumHash, imgurClientID } = subdomainConfig.imgur
 
		 return biketag.getBikeTagInformation(imgurClientID, tagnumber, albumHash, (data) => {
			 const imageUrl = getProof ? data.proofTag.link : data.previousMysteryTag.link
			 this.app.log.status(`sending the reponse from imgur direct ${imageUrl}`, imageUrl)
			 return got.stream(imageUrl).pipe(res)
		 })
	 }
 
	 getBikeTagsByUser(req, res, username) {
		 username = typeof username === 'string' ? username : null
		 const { subdomain } = res.locals
		 /// TODO: put this into sexpress
		 const subdomainIsApi = subdomain === 'api'
		 const requestSubdomain = subdomainIsApi
			 ? req.path.match(/^\/[^\/]+/)[0].substr(1)
			 : subdomain
		 const subdomainConfig = this.app.getSubdomainOpts(requestSubdomain)
		 const { albumHash, imgurClientID } = subdomainConfig.imgur
 
		 return biketag.getBikeTagsByUser(imgurClientID, albumHash, username, (images) => {
			 return res.json({ username, images })
		 })
	 }
 
	 /********		controller methods			**********/
	 init(app) {
		 this.app = app
		 biketag.setLogger(app.log.debug)
 
		 // this.index = this.show = 'apidocs'
	 }
 
	 routes(app) {
		 /********	api documented endpoints	**********/
		 /**
		  * @swagger
		  * /post/email:
		  *   post:
		  *     tags:
		  *       - biketag
		  *     description: Sends notification emails to BikeTag Ambassadors
		  *     responses:
		  *       200:
		  *         description: email success response
		  * @summary Sends notification emails to BikeTag Ambassadors
		  * @tags email
		  * @return {object} 200 - success response - application/json
		  */
		 app.route('/post/email/:tagnumber?', this.sendEmailToAdministrators, 'post', false)
		 /// How to create an insecure api route from the api controller {host}/api/post/email
 
		 /**
		  * @swagger
		  * /post/reddit/:
		  *   post:
		  *     security:
		  *       - basic: []
		  *     tags:
		  *       - biketag
		  *     description: Posts the current biketag to the configured subreddit
		  *     responses:
		  *       200:
		  *         description: reddit post information for generated posts
		  *       401:
		  *         $ref: '#/components/responses/UnauthorizedError'
		  * @summary Posts the current biketag to the configured subreddit
		  * @tags reddit
		  * @return {object} 200 - success response - application/json
		  */
		 app.route('/post/reddit/:tagnumber?', this.postToReddit, ['get', 'post'], false)
 
		 /**
		  * @swagger
		  * /post/reddit/{subreddit}:
		  *   post:
		  *     security:
		  *       - basic: []
		  *     tags:
		  *       - biketag
		  *     description: Reads a given subreddit for BikeTag posts
		  *     responses:
		  *       200:
		  *         description: reddit post information for found posts
		  *       401:
		  *         $ref: '#/components/responses/UnauthorizedError'
		  * @summary Reads a given subreddit for BikeTag posts
		  * @tags reddit
		  * @return {object} 200 - success response - application/json
		  */
		 app.apiRoute('/read/reddit/:subreddit', this.readFromReddit)
 
		 /**
		  * @swagger
		  * /patch/reddit/{subreddit}:
		  *   post:
		  *     security:
		  *       - basic: []
		  *     tags:
		  *       - biketag
		  *     description: Reads a given subreddit for BikeTag posts and creates images for the subdomain with that subreddit assigned
		  *     responses:
		  *       200:
		  *         description: reddit post information for generated posts
		  *       401:
		  *         $ref: '#/components/responses/UnauthorizedError'
		  * @summary Reads a given subreddit for BikeTag posts and creates images for the subdomain with that subreddit assigned
		  * @tags reddit
		  * @return {object} 200 - success response - application/json
		  */
		 app.apiRoute('/patch/reddit/:subreddit', this.updateBikeTagGameFromReddit)
 
		 /**
		  * @swagger
		  * /get/biketag/{tagnumber}:
		  *   post:
		  *     produces:
		  *       - application/json
		  *     parameters:
		  *       - in: formData
		  *         name: tagnumber
		  *         description: the tag number to retrieve
		  *         schema:
		  *           type: integer
		  *       - in: path
		  *         name: tagnumber
		  *         description: the tag number to retrieve
		  *         required: false
		  *         schema:
		  *           type: integer
		  *     description: Retrieves the current biketag information
		  *     tags:
		  *       - biketag
		  *     responses:
		  *       200:
		  *         description: biketag information including images
		  * @summary Posts the current biketag to the configured subreddit
		  * @tags biketag
		  * @return {object} 200 - success response - application/json
		  */
		 app.apiRoute('/get/biketag/:tagnumber?', this.getBikeTag, ['get', 'post'])
 
		 /**
		  * @swagger
		  * /get/biketag/{tagnumber}:
		  *   post:
		  *     produces:
		  *       - application/json
		  *     parameters:
		  *       - in: formData
		  *         name: tagnumber
		  *         description: the tag number to retrieve
		  *         schema:
		  *           type: integer
		  *       - in: path
		  *         name: tagnumber
		  *         description: the tag number to retrieve
		  *         required: false
		  *         schema:
		  *           type: integer
		  *     description: Retrieves the current biketag information
		  *     tags:
		  *       - biketag
		  *     responses:
		  *       200:
		  *         description: biketag information including images
		  * @summary Posts the current biketag to the configured subreddit
		  * @tags biketag
		  * @return {object} 200 - success response - application/json
		  */
		 app.apiRoute('/get/current', this.getBikeTag, ['get', 'post'])
 
		 /**
		  * @swagger
		  * /get/users:
		  *   post:
		  *     produces:
		  *       - application/json
		  *     description: Retrieves all users for a given BikeTag game
		  *     tags:
		  *       - biketag
		  *     responses:
		  *       200:
		  *         description: usernames and images
		  * @summary Retrieves all users for a given BikeTag game
		  * @tags biketag
		  * @return {object} 200 - success response - application/json
		  */
		 app.apiRoute('/get/users', this.getBikeTagsByUser, ['get', 'post'])
 
		 /**
		  * @swagger
		  * /t/{tagnumber}:
		  *   post:
		  *     produces:
		  *       - application/json
		  *     parameters:
		  *       - in: formData
		  *         name: tagnumber
		  *         description: the tag number image to retrieve
		  *         schema:
		  *           type: integer
		  *       - in: path
		  *         name: tagnumber
		  *         description: the tag number image to retrieve
		  *         required: false
		  *         schema:
		  *           type: integer
		  *     description: Retrieves the biketag image
		  *     tags:
		  *       - biketag
		  *     responses:
		  *       200:
		  *         description: biketag  image
		  * @summary Returns the mystery tag image from imgur for the given tagnumber directly from imgur
		  * @tags biketag
		  * @return {object} 200 - success response - application/json
		  */
		 app.apiRoute('/t/:tagnumber?', this.getBikeTagImage, ['get', 'post'])
 
		 /**
		  * @swagger
		  * /p/{tagnumber}:
		  *   post:
		  *     produces:
		  *       - application/json
		  *     parameters:
		  *       - in: formData
		  *         name: tagnumber
		  *         description: the proof tag number image to retrieve
		  *         schema:
		  *           type: integer
		  *       - in: path
		  *         name: tagnumber
		  *         description: the proof tag number image to retrieve
		  *         required: false
		  *         schema:
		  *           type: integer
		  *     description: Retrieves proof the biketag image
		  *     tags:
		  *       - biketag
		  *     responses:
		  *       200:
		  *         description: biketag  image
		  * @summary Returns the proof image from imgur for the given tagnumber directly from imgur
		  * @tags biketag
		  * @return {object} 200 - success response - application/json
		  */
		 app.apiRoute(
			 '/p/:tagnumber?',
			 (req, res) => {
				 return this.getBikeTagImage(req, res, true)
			 },
			 ['get', 'post'],
		 )
 
		 /**
		  * @swagger
		  * /u/{username}:
		  *   post:
		  *     produces:
		  *       - application/json
		  *     parameters:
		  *       - in: formData
		  *         name: username
		  *         description: the tag number to retrieve
		  *         schema:
		  *           type: integer
		  *       - in: path
		  *         name: username
		  *         description: the tag number to retrieve
		  *         required: false
		  *         schema:
		  *           type: integer
		  *     description: Retrieves the current biketag information
		  *     tags:
		  *       - biketag
		  *     responses:
		  *       200:
		  *         description: biketag information including images
		  * @summary Posts the current biketag to the configured subreddit
		  * @tags biketag
		  * @return {object} 200 - success response - application/json
		  */
		 app.apiRoute(
			 '/u/:username?',
			 (req, res) => {
				 const username = util.getFromQueryOrPathOrBody(req, 'username')
				 return this.getBikeTagsByUser(req, res, username)
			 },
			 ['get', 'post'],
		 )
 
		 /**
		  * @swagger
		  * /all/{count}:
		  *   post:
		  *     produces:
		  *       - application/json
		  *     parameters:
		  *       - in: formData
		  *         name: count
		  *         description: the number of tags to retrieve
		  *         required: false
		  *         schema:
		  *           type: integer
		  *       - in: path
		  *         name: count
		  *         description: the number of tags to retrieve
		  *         required: false
		  *         schema:
		  *           type: integer
		  *     description: Retrieves biketags up to a given number starting with the current tag
		  *     tags:
		  *       - biketag
		  *     responses:
		  *       200:
		  *         description: biketag  image
		  * @summary Retrieves biketags up to a given number starting with the current tag
		  * @tags biketag
		  * @return {object} 200 - success response - application/json
		  */
		 app.apiRoute(
			 '/all/:count?',
			 (req, res) => {
				 return this.getBikeTagsFromSanity(req, res)
			 },
			 ['get', 'post'],
		 )
	 }
 }
 
 module.exports = new bikeTagController()
