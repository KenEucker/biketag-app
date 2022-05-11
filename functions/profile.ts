import { Handler } from '@netlify/functions'
import axios from 'axios'
import { ErrorMessage, HttpStatusCode } from './common/constants'
import {
  isValidJson,
  getProfileAuthorization,
  acceptCorsHeaders,
  constructAmbassadorProfile,
  constructPlayerProfile,
  auth0Headers
} from './common/methods'

const profileHandler: Handler = async (event) => {
  /// Bailout on OPTIONS requests
  const headers = acceptCorsHeaders()
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: HttpStatusCode.NoContent,
      headers,
    }
  }
  /// If all else fails
  let body = 'missing authorization header'
  let statusCode = HttpStatusCode.Unauthorized
  /// Retrieves the authorization and profile data, if present
  const profile = await getProfileAuthorization(event)

  /// We can only provide profile data if the profile already exists (created by Auth0)
  if (profile && profile.sub) {
    let options = {}
    const authorizationHeaders = await auth0Headers()

    switch (event.httpMethod) {
      case 'PATCH':
        try {
          const data = JSON.parse(event.body)
          delete data.user_metadata.name
          const validator = profile.isBikeTagAmbassador
            ? 'profile.patch.ambassador'
            : 'profile.patch'
          const isValid = isValidJson(data, validator)
          if (isValid) {
            options = {
              method: 'PATCH',
              url: `https://${process.env.A_DOMAIN}/api/v2/users/${profile.sub}`,
              headers: authorizationHeaders,
              data,
            }
          } else {
            console.log(data.user_metadata.credentials)
            console.log('data is not valid', data, validator)
            body = ErrorMessage.InvalidRequestData
            statusCode = HttpStatusCode.BadRequest
          }
        } catch (e) {
          body = `${ErrorMessage.PatchFailed}: ${e.message ?? e}`
          statusCode = HttpStatusCode.BadRequest
        }
        break
      case 'GET':
        options = {
          method: 'GET',
          url: `https://${process.env.A_DOMAIN}/api/v2/users/${profile.sub}?fields=user_metadata`,
          headers: authorizationHeaders,
        }
        break
      default:
        body = ErrorMessage.MethodNotAllowed
        statusCode = HttpStatusCode.NotImplemented
    }

    if (statusCode == HttpStatusCode.Unauthorized) {
      await axios
        .request(options)
        .then(function (response) {
          if (typeof response.data === 'string') {
            body = response.data
          } else {
            const profileDataResponse = profile.isBikeTagAmbassador
              ? constructAmbassadorProfile(response.data, profile)
              : constructPlayerProfile(response.data, profile)
            body = JSON.stringify(profileDataResponse)
          }
          statusCode = HttpStatusCode.Ok
        })
        .catch(function (error) {
          console.error(error)
          statusCode = HttpStatusCode.InternalServerError
          body = error.message
        })
    }
  }

  if (statusCode !== HttpStatusCode.Ok) {
    console.error(body)
  }

  return {
    statusCode,
    headers,
    body,
  }
}

export { profileHandler as handler }
