import request from 'request'
import Ajv from 'ajv'
import CryptoJS from 'crypto-js'
import * as jose from 'jose'
import { JwtVerifier, getTokenFromHeader } from '@serverless-jwt/jwt-verifier'
import { BikeTagProfile } from '../../src/common/types'
import BikeTagClient from 'biketag'
import { Ambassador } from 'biketag/lib/common/schema'
import lzutf8 from 'lzutf8'
import qs from 'qs'
import axios from 'axios'

export const decompress = lzutf8.decompress
const ajv = new Ajv()

export type DomainInfo = {
  host: string
  subdomain: string | undefined
  isSubdomain: boolean
}

interface Event {
  headers: Record<string, unknown>
}

export interface IdentityContext {
  /**
   * The token that was provided.
   */
  token: string

  /**
   * Claims for the authenticated user.
   */
  claims: Record<string, unknown>
}

export const isValidJson = (data, type = 'none') => {
  let schema = {}

  switch (type) {
    case 'profile.patch':
      schema = {
        type: 'object',
        properties: {
          user_metadata: {
            type: 'object',
            properties: {
              passcode: { type: 'string' },
              options: {
                type: 'object',
                properties: {
                  skipSteps: { type: 'boolean' }
                },
                minProperties: 1,
                additionalProperties: false
              },
              social: {
                type: 'object',
                properties: {
                  reddit: { type: 'string' },
                  instagram: { type: 'string' },
                  twitter: { type: 'string' },
                  imgur: { type: 'string' },
                  discord: { type: 'string' }
                },
                minProperties: 1,
                additionalProperties: false
              }
            },
            minProperties: 1,
            additionalProperties: false
          }
        },
        required: ['user_metadata'],
        additionalProperties: false
      }
      break
    case 'profile.patch.ambassador':
      schema = {
        type: 'object',
        properties: {
          user_metadata: {
            type: 'object',
            properties: {
              name: { type: 'string' },
              passcode: { type: 'string' },
              options: {
                type: 'object',
                properties: {
                  skipSteps: { type: 'boolean' }
                },
                minProperties: 1,
                additionalProperties: false
              },
              social: {
                type: 'object',
                properties: {
                  reddit: { type: 'string' },
                  instagram: { type: 'string' },
                  twitter: { type: 'string' },
                  imgur: { type: 'string' },
                  discord: { type: 'string' }
                },
                minProperties: 1,
                additionalProperties: false
              },
              credentials: {
                type: 'object',
                properties: {
                  imgur: {
                    type: 'object',
                    properties: {
                      clientId: { type: 'string' },
                      clientSecret: { type: 'string' },
                      refreshToken: { type: 'string' }
                    },
                    additionalProperties: false
                  },
                  sanity: {
                    type: 'object',
                    properties: {
                      projectId: { type: 'string' },
                      dataset: { type: 'string' }
                    },
                    additionalProperties: false
                  },
                  reddit: {
                    type: 'object',
                    properties: {
                      clientId: { type: 'string' },
                      clientSecret: { type: 'string' },
                      username: { type: 'string' },
                      password: { type: 'string' }
                    },
                    additionalProperties: false
                  }
                },
                additionalProperties: false
              }
            },
            minProperties: 1,
            additionalProperties: false
          }
        },
        required: ['user_metadata'],
        additionalProperties: false
      }
      break
  }

  const validate = ajv.compile(schema)

  return validate(data)
}

export const getDomainInfo = (req: any): DomainInfo => {
  const nonSubdomainHosts = [
    `${process.env.HOST ?? 'biketag.local'}`,
    'biketag.dev',
    '0.0.0.0',
    'localhost'
  ]
  let host = (
    req.headers?.host?.length
      ? req.headers.host
      : req.location?.host?.length
      ? req.location.host
      : ''
  )
    .toLowerCase()
    .replace(/www./g, '')
  let port = null
  let subdomain = ''

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
    subdomain
  }
}

export const getBikeTagClientOpts = (
  req?: request.Request,
  authorized?: boolean,
  admin?: boolean
) => {
  const domainInfo = getDomainInfo(req)
  const isAuthenticatedPOST = req?.method === 'POST' || authorized
  const isGET = !isAuthenticatedPOST && req?.method === 'GET'
  const opts: any = {
    game: domainInfo.subdomain ?? process.env.GAME_NAME,
    cached: isGET || !isAuthenticatedPOST,
    accessToken: process.env.ACCESS_TOKEN,
    imgur: {
      clientId: process.env.I_CID
    }
  }

  if (authorized) {
    opts.imgur = opts.imgur ?? {}
    opts.imgur.clientSecret = process.env.I_CSECRET
    opts.imgur.accessToken = process.env.I_TOKEN
    opts.imgur.refreshToken = process.env.I_RTOKEN

    // opts.reddit = opts.reddit ?? {}
    // opts.reddit.clientId = process.env.R_CID
    // opts.reddit.clientSecret = process.env.R_CSECRET
    /// TODO: comes from sanity game settings
    // opts.reddit.username = process.env.R_UNAME
    // opts.reddit.password = process.env.R_PASS

    opts.sanity = opts.sanity ?? {}
    opts.sanity.projectId = process.env.S_PID
    opts.sanity.dataset = process.env.S_DSET
    opts.sanity.token = process.env.S_TOKEN

    if (admin) {
      opts.imgur.clientId = process.env.IA_CID?.length
        ? process.env.IA_CID
        : opts.imgur.clientId
      opts.imgur.clientSecret = process.env.IA_CSECRET?.length
        ? process.env.IA_CSECRET
        : opts.imgur.clientSecret
      opts.imgur.accessToken = process.env.IA_TOKEN ?? ''
      opts.imgur.refreshToken = process.env.IA_RTOKEN ?? opts.imgur.refreshToken

      opts.sanity = opts.sanity ?? {}
      opts.sanity.projectId = process.env.SA_PID
      opts.sanity.dataset = process.env.SA_DSET
      opts.sanity.token = process.env.SA_TOKEN

      // opts.reddit.clientId = process.env.RA_CID
      // opts.reddit.clientSecret = process.env.RA_CSECRET
      // opts.reddit.username = process.env.RA_UNAME
      // opts.reddit.password = process.env.RA_PASS
    }
  }

  return opts
}

const validateJWT = (verifier: JwtVerifier, options: any) => {
  return (handler: any) => async (event: Event, context: any, cb: any) => {
    let claims
    let accessToken

    try {
      accessToken = getTokenFromHeader(event.headers.authorization as string)
      claims = await verifier.verifyAccessToken(accessToken)
    } catch (err) {
      if (
        typeof options.handleError !== 'undefined' &&
        options.handleError !== null
      ) {
        return options.handleError(err)
      }

      return {
        statusCode: 401,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          error: err.code,
          error_description: err.message
        })
      }
    }

    // Expose the identity in the client context.
    const ctx: IdentityContext = {
      token: accessToken,
      claims
    }
    context.identityContext = ctx

    // Continue.
    return handler(event, context, cb)
  }
}

export const getPayloadAuthorization = async (event: any): Promise<any> => {
  let authorizationString = event.headers.authorization
  const basic = 'Basic '
  const bearer = 'Bearer '
  const client = 'Client-ID '

  const authorizationType: string =
    authorizationString?.indexOf(basic) === 0
      ? 'basic'
      : authorizationString?.indexOf(client) === 0
      ? 'client'
      : authorizationString?.indexOf(bearer) === 0
      ? 'bearer'
      : ''

  const getBasicAuthProfile = (authorizationString: string) => {
    /// Basic Auth: "Basic [name]::[password]""
    // console.log('basic', { authorizationString })
    const namePasscodeString = CryptoJS.AES.decrypt(
      authorizationString,
      process.env.HOST_KEY
    ).toString(CryptoJS.enc.Utf8)
    const namePasscodeSplit = namePasscodeString.split('::')
    return {
      name: namePasscodeSplit[0],
      passcode: namePasscodeSplit[1]
    }
  }

  const getNetlifyAuthProfile = async (authorizationString: string) => {
    // console.log('netlify', { authorizationString })
    try {
      const verifierOpts = { issuer: '', audience: '' }
      const verifier = new JwtVerifier(verifierOpts)
      return await validateJWT(verifier, verifierOpts)
    } catch (e) {
      console.error({ authorizationNetlifyValidationError: e })
    }
    return null
  }

  const getAuth0AuthProfile = async (authorizationString: string) => {
    // console.log('auth0', { authorizationString })
    try {
      const JWKS = jose.createRemoteJWKSet(
        new URL(`https://${process.env.A_DOMAIN}/.well-known/jwks.json`)
      )

      const { payload } = await jose.jwtVerify(authorizationString, JWKS)
      return payload
    } catch (e) {
      /// Swallow error
      // console.error({ authorizationAuth0ValidationError: e })
      return authorizationString
    }
  }

  /// DEBUG: uncomment to check incoming authorization credentials
  // console.log({ orign: event.headers.authorization, authorizationType, authorizationString })

  switch (authorizationType) {
    case 'basic':
      authorizationString = authorizationString.substring(basic.length)
      return getBasicAuthProfile(authorizationString)
    case 'netlify':
      authorizationString = authorizationString.substring(client.length)
      return getNetlifyAuthProfile(authorizationString)
    case 'client':
      authorizationString = authorizationString.substring(client.length)
      return getAuth0AuthProfile(authorizationString)
    case 'bearer':
      authorizationString = authorizationString.substring(bearer.length)
      return getAuth0AuthProfile(authorizationString)
    default:
      return authorizationString?.length
        ? 'authorization type not supported'
        : authorizationString
  }
}

export const getThisGamesAmbassadors = async (
  client: BikeTagClient,
  adminBikeTagOpts?: any
) => {
  if (!client) {
    adminBikeTagOpts =
      adminBikeTagOpts ??
      getBikeTagClientOpts(
        {
          method: 'get'
        } as unknown as request.Request,
        true,
        true
      )
  }
  client = client ?? new BikeTagClient(adminBikeTagOpts)
  const thisGamesAmbassadors = await client.ambassadors(undefined, {
    source: 'sanity'
  })

  return thisGamesAmbassadors
}

export const getProfileAuthorization = async (event: any): Promise<any> => {
  const authorization = await getPayloadAuthorization(event)
  let profile: any = authorization

  if (authorization) {
    const biketagOpts = getBikeTagClientOpts(event, true, true)
    const biketag = new BikeTagClient(biketagOpts)
    const thisGamesAmbassadors = (await getThisGamesAmbassadors(
      biketag
    )) as Ambassador[]
    const profileAmbassadorMatch = thisGamesAmbassadors.filter(
      (a) => a.email === profile.email
    )

    if (profileAmbassadorMatch.length) {
      profile.isBikeTagAmbassador = true
      profile = { ...profile, ...profileAmbassadorMatch[0] }
    }
  }

  /// TODO: pear down this object to only the things we care about
  return profile
}

export const getEnvironmentVariable = (key: string) => {
  if (process.env[key]) {
    return decompress(process.env[key], { inputEncoding: 'Base64' })
  }
}

const getAuthManagementToken = async () => {
  try {
    return await axios({
      method: 'POST',
      url: `https://${process.env.A_DOMAIN}/oauth/token`,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: qs.stringify({
        grant_type: 'client_credentials',
        client_id: process.env.A_M_CID,
        client_secret: process.env.A_M_CS,
        audience: process.env.A_AUDIENCE
      })
    })
  } catch (e) {
    console.log(e)
  }
}

export const auth0Headers = async () => ({
  Authorization: `Bearer ${
    (await getAuthManagementToken())?.data?.access_token
  }`
})

export const acceptCorsHeaders = () => ({
  Accept: '*',
  'Access-Control-Allow-Headers': '*',
  'Content-Type': 'application/json',
  'Access-Control-Allow-Methods': '*',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Max-Age': '8640'
})

export const constructAmbassadorProfile = (
  profile: any = {},
  defaults: any = {}
): BikeTagProfile => {
  const user_metadata = {
    name: profile?.user_metadata?.name ?? defaults?.user_metadata?.name ?? '',
    passcode:
      profile?.user_metadata?.passcode ??
      defaults?.user_metadata?.passcode ??
      '',
    social: {
      reddit:
        profile?.user_metadata?.social?.reddit ??
        defaults?.user_metadata?.social?.reddit ??
        '',
      instagram:
        profile?.user_metadata?.social?.instagram ??
        defaults?.user_metadata?.social?.instagram ??
        '',
      twitter:
        profile?.user_metadata?.social?.twitter ??
        defaults?.user_metadata?.social?.twitter ??
        '',
      imgur:
        profile?.user_metadata?.social?.imgur ??
        defaults?.user_metadata?.social?.imgur ??
        '',
      discord:
        profile?.user_metadata?.social?.discord ??
        defaults?.user_metadata?.social?.discord ??
        ''
    },
    credentials: {
      imgur: {
        clientId:
          profile?.user_metadata?.credentials?.imgur.clientId ??
          defaults?.user_metadata?.credentials?.imgur.clientId ??
          '',
        clientSecret:
          profile?.user_metadata?.credentials?.imgur.clientSecret ??
          defaults?.user_metadata?.credentials?.imgur.clientSecret ??
          '',
        refreshToken:
          profile?.user_metadata?.credentials?.imgur.refreshToken ??
          defaults?.user_metadata?.credentials?.imgur.refreshToken ??
          ''
      },
      sanity: {
        projectId:
          profile?.user_metadata?.credentials?.sanity.projectId ??
          defaults?.user_metadata?.credentials?.sanity.projectId ??
          '',
        dataset:
          profile?.user_metadata?.credentials?.sanity.dataset ??
          defaults?.user_metadata?.credentials?.sanity.dataset ??
          ''
      },
      reddit: {
        clientId:
          profile?.user_metadata?.credentials?.reddit.clientId ??
          defaults?.user_metadata?.credentials?.reddit.clientId ??
          '',
        clientSecret:
          profile?.user_metadata?.credentials?.reddit.clientSecret ??
          defaults?.user_metadata?.credentials?.reddit.clientSecret ??
          '',
        username:
          profile?.user_metadata?.credentials?.reddit.username ??
          defaults?.user_metadata?.credentials?.reddit.username ??
          '',
        password:
          profile?.user_metadata?.credentials?.reddit.password ??
          defaults?.user_metadata?.credentials?.reddit.password ??
          ''
      }
    },
    options: {
      skipSteps:
        profile?.user_metadata?.options?.skipSteps ??
        defaults?.user_metadata?.options?.skipSteps ??
        false
    }
  }
  return {
    name: profile.name ?? defaults.name ?? '',
    sub: profile.sub ?? defaults.sub ?? '',
    slug: profile.slug ?? defaults.slug ?? '',
    address1: profile.address1 ?? defaults.address1 ?? '',
    address2: profile.address2 ?? defaults.address2 ?? '',
    city: profile.city ?? defaults.city ?? '',
    country: profile.country ?? defaults.country ?? '',
    email: profile.email ?? defaults.email ?? '',
    isBikeTagAmbassador:
      profile.isBikeTagAmbassador ?? defaults.isBikeTagAmbassador ?? '',
    locale: profile.locale ?? defaults.locale ?? '',
    nonce: profile.nonce ?? defaults.nonce ?? '',
    phone: profile.phone ?? defaults.phone ?? '',
    picture: profile.picture ?? defaults.picture ?? '',
    user_metadata,
    zipcode: profile.zipcode ?? defaults.zipcode ?? ''
  }
}

export const constructPlayerProfile = (
  profile: any = {},
  defaults: any = {}
): BikeTagProfile => {
  const user_metadata = {
    name: profile?.user_metadata?.name ?? defaults?.user_metadata?.name ?? '',
    social: {
      reddit:
        profile?.user_metadata?.reddit ?? defaults?.user_metadata?.reddit ?? '',
      instagram:
        profile?.user_metadata?.instagram ??
        defaults?.user_metadata?.instagram ??
        '',
      twitter:
        profile?.user_metadata?.twitter ??
        defaults?.user_metadata?.twitter ??
        '',
      imgur:
        profile?.user_metadata?.imgur ?? defaults?.user_metadata?.imgur ?? '',
      discord:
        profile?.user_metadata?.discord ??
        defaults?.user_metadata?.discord ??
        ''
    },
    options: {
      skipSteps:
        profile?.user_metadata?.options?.skipSteps ??
        defaults?.user_metadata?.options?.skipSteps ??
        false
    }
  }
  return {
    name: profile.name ?? defaults.name ?? '',
    sub: profile.sub ?? defaults.sub ?? '',
    slug: profile.slug ?? defaults.slug ?? '',
    email: profile.email ?? defaults.email ?? '',
    locale: profile.locale ?? defaults.locale ?? '',
    nonce: profile.nonce ?? defaults.nonce ?? '',
    picture: profile.picture ?? defaults.picture ?? '',
    user_metadata,
    zipcode: profile.zipcode ?? defaults.zipcode ?? ''
  } as BikeTagProfile
}
