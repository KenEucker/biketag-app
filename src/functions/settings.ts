import { BikeTagClient } from 'biketag'
import { getSettingsPayload } from 'biketag/lib/common/payloads'

const settingsHandler = async (client: BikeTagClient, payload: any) => {
  const settingsResponse = await client.getSettings(payload as getSettingsPayload, {
    source: 'imgur',
  })
  const { success, data } = settingsResponse

  return {
    statusCode: settingsResponse.status,
    body: JSON.stringify(success ? data : settingsResponse),
  }
}

export default settingsHandler