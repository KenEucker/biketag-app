/**
 * Module dependencies.
 */
const biketag = require('../lib/biketag')
const { getFromQueryOrPathOrBody } = require('../lib/util')
const request = require('request')

class IndexController {
    init(app) {
        this.app = app
        biketag.setLogger(app.log.debug)

        Object.keys(this.app.config.subdomains).forEach((subdomain) => {
            const subdomainInformation = this.app.config.subdomains[subdomain]

            /// Set the description of the API for this subdomain to the tagline.
            subdomainInformation.meta = subdomainInformation.meta ? subdomainInformation.meta : {}
            subdomainInformation.meta.description = subdomainInformation.tagline

            /// Copy over the email information, if it's not set by the subdomain
            subdomainInformation.email =
                subdomainInformation.email || this.app.config.authentication.email

            this.app.config.subdomains[subdomain] = subdomainInformation
        })
    }

    indexHandler(req, res) {
        const { subdomain, host } = res.locals
        const template = this.app.getTemplateNameFromSubdomain(subdomain)
        const pageData = this.app.getPublicData(subdomain, host, undefined, res)
        const subdomainConfig = this.app.getSubdomainOpts(subdomain)

        if (subdomainConfig.imgur && subdomain !== 'index') {
            const { albumHash, imgurClientID } = subdomainConfig.imgur
            return biketag.getTagInformation(imgurClientID, 'current', albumHash, (data) => {
                const bikeTagPageData = { ...pageData, currentBikeTag: data || {} }

                return this.app.renderTemplate(template, bikeTagPageData, res)
            })
        }

        return this.app.renderTemplate(template, pageData, res)
    }

    getUserTags(req, res) {
        const { subdomain, host } = res.locals
        const username = getFromQueryOrPathOrBody(req, 'username')
        /// TODO: put this into sexpress
        const subdomainIsApi = subdomain === 'api'
        const requestSubdomain = subdomainIsApi
            ? req.path.match(/^\/[^\/]+/)[0].substr(1)
            : subdomain

        const subdomainConfig = this.app.getSubdomainOpts(requestSubdomain)
        const { albumHash, imgurClientID } = subdomainConfig.imgur

        return biketag.getBikeTagsByUser(imgurClientID, albumHash, username, (images) => {
            let template = 'users/user'
            const pageData = this.app.getPublicData(requestSubdomain, host, undefined, res)
            const bikeTagUserPageData = { ...pageData, images, username }

            if (!username) {
                template = 'users'
                bikeTagUserPageData.usernames = Object.keys(images)
            }

            return this.app.renderTemplate(template, bikeTagUserPageData, res)
        })
    }

    getLeaderboard(req, res) {
        const { subdomain, host } = res.locals
        /// TODO: put this into sexpress
        const subdomainIsApi = subdomain === 'api'
        const requestSubdomain = subdomainIsApi
            ? req.path.match(/^\/[^\/]+/)[0].substr(1)
            : subdomain

        const subdomainConfig = this.app.getSubdomainOpts(requestSubdomain)
        const { albumHash, imgurClientID } = subdomainConfig.imgur

        return biketag.getBikeTagsByUser(imgurClientID, albumHash, undefined, (images) => {
            const usernames = Object.keys(images)
            const imagesLength = usernames.reduce((o, u) => o + images[u].length, 0)
            const sortedUsernames = usernames.sort((a, b) => {
                const aLen = images[a].length
                const bLen = images[b].length

                if (aLen > bLen) {
                    return -1
                }
                if (aLen < bLen) {
                    return 1
                }

                return 0
            })

            const sortedImagesByLeader = {}
            sortedUsernames.forEach((username) => {
                sortedImagesByLeader[username] = images[username]
            })
            const template = 'users/leaderboard'
            const pageData = this.app.getPublicData(requestSubdomain, host, undefined, res)
            const bikeTagUserPageData = {
                ...pageData,
                images: sortedImagesByLeader,
                imagesTotal: Math.round(imagesLength / 2 - (imagesLength % 2)),
                usernames: sortedUsernames,
            }

            return this.app.renderTemplate(template, bikeTagUserPageData, res)
        })
    }

    getCurrent(req, res) {
        const { subdomain } = res.locals
        const size = getFromQueryOrPathOrBody(req, 's') || getFromQueryOrPathOrBody(req, 'size')
        const tagnumber = 'current'

        /// TODO: put this into sexpress
        const subdomainIsApi = subdomain === 'api'
        const requestSubdomain = subdomainIsApi
            ? req.path.match(/^\/[^\/]+/)[0].substr(1)
            : subdomain

        const subdomainConfig = this.app.getSubdomainOpts(requestSubdomain)
        const { albumHash, imgurClientID } = subdomainConfig.imgur

        this.app.log.status(`reddit endpoint request for tag #${tagnumber}`)

        return biketag.getTagInformation(imgurClientID, tagnumber, albumHash, (data) => {
            // data.host = host
            // data.region = subdomainConfig.region
            let imageUri = biketag.getBiketagImageUrl(data.currentTagURL, size)

            return req.pipe(request(imageUri)).pipe(res)
        })
    }

    getRedditPostTemplate(req, res) {
        const { subdomain, host } = res.locals
        const tagnumber = biketag.getTagNumberFromRequest(req)
        const redditTemplatePath = 'reddit/post'
        const subdomainConfig = this.app.getSubdomainOpts(subdomain)

        if (!subdomainConfig.imgur) {
            this.app.log.status(`imgur not set for host on subdomain [${subdomain}]`, host)
            return res.send('no image data set')
        }

        const { albumHash, imgurClientID } = subdomainConfig.imgur

        this.app.log.status(`reddit endpoint request for tag #${tagnumber}`, { redditTemplatePath })

        return biketag.getTagInformation(imgurClientID, tagnumber, albumHash, (data) => {
            if (!data) {
                return res.json({
                    tagNumberNotFound: tagnumber,
                    albumHash,
                })
            }

            data.host = `${
                subdomainConfig.requestSubdomain ? `${subdomainConfig.requestSubdomain}.` : ''
            }${subdomainConfig.requestHost || host}`
            data.region = subdomainConfig.region

            return res.render(redditTemplatePath, data)
        })
    }

    routes(app) {
        app.use((req, res, next) => {
            const flushcache = getFromQueryOrPathOrBody(req, 'flushcache')
            if (flushcache === 'true') {
                this.app.log.status('flushing cache')
                biketag.flushCache()
            }
            next()
        })

        app.route('/get/reddit/:tagnumber?', this.getRedditPostTemplate)

        app.route('/user', this.getUserTags)
        app.route('/user/:username', this.getUserTags)

        app.route('/leaderboard', this.getLeaderboard)

        app.route('/current', this.getCurrent)

        app.route('/:tagnumber?', this.indexHandler)
    }
}

module.exports = new IndexController()
