# Our application's javascript API for both servers and clients
class BikeTagApi

	constructor: (opts = {}) ->
		@specUrl = opts.specUrl ? '/api/swagger.json'
		@init()

	init: () ->
		# this activates CORS, if necessary
		SwaggerClient.http.withCredentials = true
		new SwaggerClient(@specUrl).then(((swaggerClient) ->
			window.apiClient = swaggerClient
		), (reason) ->
			console.error 'failed to load the spec' + reason
			return
		)

	yo: (yo) ->
		console.log "#{yo} dawg."
		window.apiClient.apis.default.post_v1_yo__yo_ yo: yo
		.then ((yoResult) ->
			console.log yoResult.obj
			document.getElementsByTagName('p').item(0).innerText = yoResult.obj.yo
			return
		), (reason) ->
			console.error 'failed on API call ' + reason
			return

module.exports = new BikeTagApi()
