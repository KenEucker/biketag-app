import { IApiResponse } from 'src/interface/IApiResponse';
import { request, HttpMethod } from './api-service';
import { IGames, IGamesTag } from 'src/interface/IGames';
export async function fetchGames(): Promise<
  [IApiResponse<IGames> | null, IApiResponse<IGames> | null]
> {
  return request<IGames, null>('/users', HttpMethod.GET);
}

export async function fetchGamesTag(
  id: number | string
): Promise<[IApiResponse<IGamesTag> | null, IApiResponse<IGamesTag> | null]> {
  return request<IGamesTag, null>(`/users/${id}/todos`, HttpMethod.GET);
}
