/**
 * Module dependencies.
 */
const biketag = require('../../lib/biketag')
const request = require('request')
const util = require('../../lib/util')

class bikeTagController {
    postToReddit(req, res) {
        const { subdomain, host } = res.locals
        const subdomainConfig = this.app.getSubdomainOpts(subdomain)
        const expiry = util.getFromQueryOrPathOrBody(req, 'expiry')
        const expiryHash = expiry ? this.app.crypto().decrypt(expiry) : null

        if (!subdomainConfig.reddit.autoPost) {
            return res.json({
                error: `Subdomain is not configured to support autoposting to Reddit, please contact support@biketag.org for help turning this feature on.`,
                subdomain,
            })
        }

        /// Check the expiry, if no match then don't allow this post
        if (expiryHash) {
            const expiryHashTime = new Date(expiryHash.expiry).getTime()
            if (new Date().getTime() > expiryHashTime || subdomain !== expiryHash.subdomain) {
                /// TODO: add the request nonce to this hash so that we can ensure this action is only run once
                return res.json(
                    `Link expired. Check r/${subdomainConfig.reddit.subreddit} to see if it's already been posted?`,
                )
            }
        } else {
            return res.json({ message: 'cannot validate link', expiry })
        }

        subdomainConfig.requestSubdomain = subdomain
        subdomainConfig.host = host
        subdomainConfig.viewsFolder = this.app.config.viewsFolder
        subdomainConfig.version = this.app.config.version
        subdomainConfig.auth = this.app.authTokens[subdomain].redditBot
            ? this.app.authTokens[subdomain].redditBot.opts
            : subdomainConfig.reddit
        subdomainConfig.auth.clientId = subdomainConfig.auth.clientID
        subdomainConfig.imgur = this.app.middlewares.util.merge(
            subdomainConfig.imgur,
            this.app.authTokens[subdomain].imgur,
        )

        const { albumHash, imgurClientID } = subdomainConfig.imgur
        return biketag
            .getTagInformation(
                imgurClientID,
                'current',
                albumHash,
                (currentTagInfo) => {
                    subdomainConfig.currentTagInfo = currentTagInfo

                    return biketag.postCurrentBikeTagToReddit(
                        subdomainConfig,
                        async (response) => {
                            if (!response.error && response.selfPostName) {
                                this.app.log.status('posted to reddit', response)
                                if (response.crossPostName) {
                                    const mainRedditAccount =
                                        this.app.config.authentication.reddit ||
                                        subdomainConfig.reddit
                                    const regionName = `${subdomain
                                        .charAt(0)
                                        .toUpperCase()}${subdomain.slice(1)}`
                                    subdomainConfig.auth.username = mainRedditAccount.username
                                    subdomainConfig.auth.password = mainRedditAccount.password

                                    await biketag
                                        .setBikeTagPostFlair(
                                            subdomainConfig,
                                            { selfPostName: response.crossPostName },
                                            regionName,
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
                                    title: subdomainConfig.currentTagInfo.image.title,
                                    description: `${subdomainConfig.currentTagInfo.image.description} | ${discussionUrl}`,
                                }

                                await biketag
                                    .setTagImageInformation(
                                        imgurClientID,
                                        updatedImage,
                                        (response) => {
                                            console.log(
                                                'setTagImageInformation',
                                                response,
                                                updatedImage,
                                            )
                                        },
                                    )
                                    .catch((error) => {
                                        this.app.log.error(`setTagImageInformation failed`, {
                                            error,
                                            updatedImage,
                                        })
                                    })

                                return res.json({ success: response })
                            }

                            return res.json({ error: response })
                        },
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

    async sendEmailToAdministrators(req, res) {
        try {
            const { subdomain, host } = res.locals
            const tagnumber = biketag.getTagNumberFromRequest(req) || 'current'
            const subdomainConfig = this.app.getSubdomainOpts(subdomain)
            const { albumHash, imgurClientID } = subdomainConfig.imgur
            const expiry = new Date(
                new Date().getTime() + 60 * 60 * 1000 * (this.app.config.expiryDays || 2),
            )
            const emailSecurityHashData = {
                subdomain,
                tagnumber,
                expiry,
                emails: subdomainConfig.adminEmailAddresses,
            }
            const expiryHash = encodeURIComponent(this.app.crypto().encrypt(emailSecurityHashData))

            /// Wait for the data to hit reddit
            const getTagInformationSleep = 10000
            this.app.log.status(
                `waiting for ${getTagInformationSleep}ms until getting new tag information for recent post`,
            )

            console.log({ expiryHash })
            res.json({ wait: getTagInformationSleep })

            const tryGettingLatest = async (attempt = 1) => {
                await biketag.flushCache()
                await util.sleep(getTagInformationSleep)

                return biketag.getTagInformation(
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
                            region: subdomainConfig.region,
                            subdomainIcon: subdomainConfig.meta.image,
                            host: `${
                                subdomainConfig.requestSubdomain
                                    ? `${subdomainConfig.requestSubdomain}.`
                                    : ''
                            }${subdomainConfig.requestHost || host}`,
                            currentTagInfo,
                            expiryHash,
                            reddit: subdomainConfig.reddit.subreddit,
                        }

                        const text = this.app.renderSync('mail/newBikeTagText', renderOpts)
                        const html = this.app.renderSync('mail/newBikeTag', renderOpts)

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
        const { subdomain, host } = res.locals
        const subreddit = util.getFromQueryOrPathOrBody(req, 'subreddit')
    }

    getRedditPost(req, res) {
        const { subdomain, host } = res.locals
        const tagnumber = biketag.getTagNumberFromRequest(req)
        const subdomainConfig = this.app.getSubdomainOpts(subdomain)
        const { albumHash, imgurClientID } = subdomainConfig.imgur

        this.app.log.status(`reddit endpoint request for tag #${tagnumber}`)

        return biketag.getTagInformation(imgurClientID, tagnumber, albumHash, (data) => {
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

    getBikeTag(req, res) {
        const { subdomain, host } = res.locals
        const tagnumber = biketag.getTagNumberFromRequest(req)
        /// TODO: put this into sexpress
        const subdomainIsApi = subdomain === 'api'
        const requestSubdomain = subdomainIsApi
            ? req.path.match(/^\/[^\/]+/)[0].substr(1)
            : subdomain

        const subdomainConfig = this.app.getSubdomainOpts(requestSubdomain)
        const { albumHash, imgurClientID } = subdomainConfig.imgur

        this.app.log.status(`reddit endpoint request for tag #${tagnumber}`)

        return biketag.getTagInformation(imgurClientID, tagnumber, albumHash, (data) => {
            data.host = host
            data.region = subdomainConfig.region

            return res.json(data)
        })
    }

    getBikeTagImage(req, res, getProof = false) {
        const { subdomain } = res.locals
        const tagnumber = biketag.getTagNumberFromRequest(req)
        /// TODO: put this into sexpress
        const subdomainIsApi = subdomain === 'api'
        const requestSubdomain = subdomainIsApi
            ? req.path.match(/^\/[^\/]+/)[0].substr(1)
            : subdomain

        const subdomainConfig = this.app.getSubdomainOpts(requestSubdomain)
        const { albumHash, imgurClientID } = subdomainConfig.imgur

        return biketag.getTagInformation(imgurClientID, tagnumber, albumHash, (data) => {
            const imageUrl = getProof ? data.proofTag.link : data.previousMysteryTag.link
            this.app.log.status(`sending the reponse from imgur direct ${imageUrl}`, imageUrl)
            return req.pipe(request(imageUrl)).pipe(res)
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
        app.apiRoute('/read/reddit/', this.readFromReddit)

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
                const username = util.getFromQueryOrPathOrBody(r, 'username')
                return this.getBikeTagsByUser(req, res, username)
            },
            ['get', 'post'],
        )
    }
}

module.exports = new bikeTagController()
