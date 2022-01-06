import request from 'request'

export type DomainInfo = {
  host: string
  subdomain: string | undefined
  isSubdomain: boolean
}

export const getImgurImageSized = (imgurUrl = '', size = 'm') =>
  imgurUrl
    .replace('.jpeg', `${size}.jpg`)
    .replace('.jpg', `${size}.jpg`)
    .replace('.gif', `${size}.gif`)
    .replace('.png', `${size}.png`)
    .replace('.mp4', `${size}.mp4`)

export const getDomainInfo = (req: request.Request | undefined, win?: Window): DomainInfo => {
  const nonSubdomainHosts = [
    `${process.env.HOST ?? 'biketag.local'}`,
    'biketag.dev',
    '0.0.0.0',
    'localhost',
  ]
  let host = (req ? req.headers.host : win ? win.location.host : '')
    .toLowerCase()
    .replace(/www./g, '')
  let port = null
  let subdomain

  if (host.indexOf(':') > 0) {
    ;[host, port] = host.split(':')
  }

  const isSubdomain = nonSubdomainHosts.indexOf(host) === -1

  if (isSubdomain) {
    const hostSplit = host.split('.')
    subdomain = hostSplit[0]
    host = hostSplit.join('.')
  }

  return {
    host: host + (port ? ':' + port : ''),
    isSubdomain,
    subdomain,
  }
}

// export const parseMultipartForm = async (event: any): Promise<any> => {
//   return new Promise((resolve) => {
//     // we'll store all form fields inside of this
//     const fields: any = {}

//     // let's instantiate our busboy instance!
//     const busboy = new Busboy({
//       // it uses request headers
//       // to extract the form boundary value (the ----WebKitFormBoundary thing)
//       headers: event.headers, //{ ...event.headers, 'content-type': event.headers['Content-Type'] },
//     })

//     // before parsing anything, we need to set up some handlers.
//     // whenever busboy comes across a file ...
//     busboy.on(
//       'file',
//       (
//         fieldname: string | number,
//         filestream: { on: (arg0: string, arg1: (data: any) => void) => void },
//         filename: any,
//         transferEncoding: any,
//         mimeType: any
//       ) => {
//         // ... we take a look at the file's data ...
//         filestream.on('data', (data) => {
//           // ... and write the file's name, type and content into `fields`.
//           fields[fieldname] = {
//             filename,
//             type: mimeType,
//             content: data,
//           }
//         })
//       }
//     )

//     // whenever busboy comes across a normal field ...
//     busboy.on('field', (fieldName: string | number, value: any) => {
//       // ... we write its value into `fields`.
//       fields[fieldName] = value
//     })

//     // once busboy is finished, we resolve the promise with the resulted fields.
//     busboy.on('finish', () => {
//       resolve(fields)
//     })

//     // now that all handlers are set up, we can finally start processing our request!
//     busboy.write(event.body)
//   })
// }

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

export const getBikeTagClientOpts = (req?: request.Request) => {
  const domainInfo = getDomainInfo(req)
  const isAuthenticatedPOST = req?.method === 'POST'
  const isGET = !isAuthenticatedPOST && req?.method === 'GET'
  return {
    game: domainInfo.subdomain ?? process.env.GAME_NAME,
    cached: isGET || !isAuthenticatedPOST,
    imgur: {
      clientId: process.env.IMGUR_CLIENT_ID,
      accessToken: process.env.IMGUR_ACCESS_TOKEN,
      hash: process.env.IMGUR_HASH,
    },
    sanity: {
      projectId: process.env.SANITY_PROJECT_ID,
      dataset: process.env.SANITY_DATASET,
    },
  }
}
