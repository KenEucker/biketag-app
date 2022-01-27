
export const parseQuery = (query = '') => {
    const params: any = new URLSearchParams(query) ?? []
    return Object.fromEntries(params)
}

export const parseBody = (body = '') => {
    let parsed = {}
    try {
        parsed = JSON.parse(body)
    } catch (e) {
        parsed = parseQuery(body)
    }

    return parsed
}

export const getPayloadOpts = (event: any, base = {}): any => {
    const parsedQuery = parseQuery(event.rawQuery)
    const parsedBody = parseBody(event.body)
    return {
        ...base,
        ...parsedQuery,
        ...parsedBody,
    }
}