const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

const getFromQueryOrPathOrBody = (req, name, orThis, parser) => {
	if (!parser) {
		if (typeof orThis === 'boolean') {
			parser = (s) => typeof s !== 'undefined' ? (s.length ? s === 'true' : true) : false
		} else {
			parser = (v) => v
		}
	}
    const queryParam = parser(req.query[name])
    const pathParam = parser(req.params[name])
	const bodyParam = parser(req.body[name])
	
    if (typeof queryParam !== 'undefined') return queryParam
    if (typeof pathParam !== 'undefined') return pathParam
    if (typeof bodyParam !== 'undefined') return bodyParam

    return orThis
}

module.exports = {
    sleep,
    getFromQueryOrPathOrBody,
}
