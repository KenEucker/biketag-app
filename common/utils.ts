const runtimeConfig = useRuntimeConfig()

export const parseQuery = (query = '') => {
  const params: any = new URLSearchParams(query) ?? []
  return Object.fromEntries(params)
}


export const getLogoUrl = (
  logo: string,
  size = '',
  sanityBaseCDNUrl = 'https://cdn.sanity.io/images/x37ikhvs/production/'
) => {
  switch (size) {
    case 'l':
      size = 'h=512'
      break
    case 'm':
      size = 'h=256'
      break
    case 's':
      size = 'h=192'
      break
    default:
      size = 'h=45'
      break
  }
  return logo?.length
    ? `${sanityBaseCDNUrl}${logo
      .replace('image-', '')
      .replace('-png', '.png')
      .replace('-webp', '.webp')
      .replace('-jpg', '.jpg')}${size.length ? `?${size}` : ''}`
    : '/assets/biketag-logo.svg'
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

export const getApiUrl = (path = '') => {
  const url =
    runtimeConfig.public.CONTEXT === 'dev'
      ? `${window.location.protocol}//${window.location.hostname}:7200/.netlify/functions/${path}`
      : `/api/${path}`

  return url
}
