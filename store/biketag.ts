import type { AmbassadorProfile } from '../common/types'
import type { Game, Tag } from 'biketag/lib/common/schema'

import { defineStore, acceptHMRUpdate } from 'pinia'
import BikeTagClient from 'biketag'
import { getApiUrl } from '~/common/utils'

interface TagsFromGames {
  [key: string]: Tag[]
}
interface BikeTagAppState {
  games: Game[]
  tagsFromGames: TagsFromGames,
  profile: AmbassadorProfile
}

const getBikeTagConfig = (admin?: boolean, game?: Game) => {
  const opts: any = {
    game: undefined,
    accessToken: runtimeConfig.public.ACCESS_TOKEN,
    imgur: {},
    sanity: {},
  }
  opts.imgur.clientId = runtimeConfig.public.IA_CID
  opts.imgur.clientSecret = runtimeConfig.public.IA_CSECRET
  opts.imgur.accessToken = runtimeConfig.public.IA_TOKEN ?? ''
  opts.imgur.refreshToken = runtimeConfig.public.IA_RTOKEN ?? opts.imgur.refreshToken

  if (admin) {
    opts.sanity.projectId = runtimeConfig.public.SA_PID
    opts.sanity.dataset = runtimeConfig.public.SA_DSET
    opts.sanity.token = runtimeConfig.public.SA_TOKEN
  } else {
    opts.sanity.projectId = runtimeConfig.public.S_PID
    opts.sanity.dataset = runtimeConfig.public.S_DSET
    opts.sanity.token = runtimeConfig.public.S_TOKEN
  }

  if (game) {
    opts.game = game.slug
  }

  return opts
}

const runtimeConfig = useRuntimeConfig()
const biketagConfig = getBikeTagConfig(false)
console.log({biketagConfig})
const biketagClient = new BikeTagClient(biketagConfig)
export const useBikeTagStore = defineStore({
  id: 'biketagAppState',
  state: (): BikeTagAppState => ({
    games: [] as Game[],
    tagsFromGames: {} as TagsFromGames,
    profile: {} as AmbassadorProfile
  }),
  getters: {
    allGames: (state: BikeTagAppState): Array<Game> => state.games,
    tags: (state: BikeTagAppState): any => {
      return (gameName: string): Array<Tag> =>
        state.tagsFromGames[gameName]
          ? state.tagsFromGames[gameName]
          : ([] as Tag[])
    },
    getGame: (state: BikeTagAppState): any => {
      return (gameName: string) =>
        state.games.filter((val) => val.name == gameName)[0]
    },
    getProfile: (state: BikeTagAppState): any => state.profile
  },
  actions: {
    async setGames() {
      return biketagClient
        .getGame(undefined, {
          source: 'sanity',
        })
        .then((d) => {
          console.log(d)
          if (d.success) {
            const games = d.data as unknown as Game[]
            // const supportedGames: Game[] = games.filter(
            //   (g: Game) =>
            //     g.mainhash?.length &&
            //     g.archivehash?.length &&
            //     g.queuehash?.length
            // )
            this.games = games// supportedGames
          }
        })
        .catch((e) => {
          console.log(e)
        })
    },
    async updateGame(game: Game, updatedGame: Game) {
      if (game) {
        const stateGame = this.getGame()
        const adminConfig = getBikeTagConfig(true, game)
        const nonadminConfig = getBikeTagConfig(false, game)
        const biketagAdmin = new BikeTagClient(adminConfig)
        const biketag = new BikeTagClient(nonadminConfig)
        /// Save to admin, only the values needed for admin
        /// Save to non-admin, only the values needed for non-admin
        if (game.logo != updatedGame.logo || game.subreddit != updatedGame.subreddit) {
          await biketag.updateGame({
            ...game,
            logo: updatedGame.logo,
            subreddit: updatedGame.subreddit
          }, { source: 'sanity' })
        }
        return await biketagAdmin.updateGame(updatedGame, { source: 'sanity' })
      }
      return false
    },
    async launchGame(game: Game, tag: Tag) {
      const adminConfig = getBikeTagConfig(true, game)
      // adminConfig.game = game?.slug
      // adminConfig.imgur.hash = game.mainhash
      const biketagAdmin = new BikeTagClient(adminConfig)
      const launchGameResult = await biketagAdmin.updateGame(game, { source: 'sanity' })
      return [
        launchGameResult,
        await biketagAdmin.updateTag(tag)
      ]
    },
    async setTagsFromGame(gameName: string) {
      if (this.games.length === 0) {
        await this.setGames()
        const game = this.games.filter(
          (v) => v.name.toLowerCase() === gameName.toLowerCase()
        )[0]
        if (game) {
          return biketagClient
            .getTags(undefined, {
              game: game.slug,
              hash: game.mainhash,
              source: 'imgur',
            })
            .then((d) => {
              console.log(d)
              this.tagsFromGames[gameName] = d.data
            })
            .catch((e) => console.log(e))
        }
      } else {
        const game = this.games.filter(
          (v) => v.name.toLowerCase() === gameName.toLowerCase()
        )[0]
        if (game) {
          return biketagClient
            .getTags(undefined, {
              game: game.slug,
              hash: game.mainhash,
              source: 'imgur',
            })
            .then((d) => {
              console.log(d)
              this.tagsFromGames[gameName] = d.data
            })
            .catch((e) => console.log(e))
        }
      }
    },
    updateTag(tag: Tag, gameName: string) {
      const game = this.getGame(gameName)
      if (game) {
        const adminConfig = getBikeTagConfig(true, game)
        adminConfig.game = game?.slug
        adminConfig.imgur.hash = game.mainhash
        const biketagAdmin = new BikeTagClient(adminConfig)
        return biketagAdmin.updateTag(tag)
      }
    },
    createTag(tag: {}): Tag {
      return BikeTagClient.createTagObject(tag)
    },
    async importTags(tags: Tag[], gameName: string) {
      for (const tag of tags) {
        try {
          await this.updateTag(tag, gameName)
        } catch (e) {
          console.log(e)
          throw e
        }
      }
    },
    async updateProfile(profile: AmbassadorProfile, token: string) {
      const user_metadata = profile.user_metadata
      const updatedProfileResponse = await biketagClient.plainRequest({
        method: 'PATCH',
        url: getApiUrl('profile'),
        headers: {
          authorization: `Bearer ${token}`,
          'content-type': 'application/json',
        },
        data: { user_metadata },
      })
      this.profile = updatedProfileResponse.data
    },
    async setProfile(token: string) {
      const response = await biketagClient.plainRequest({
        method: 'GET',
        url: getApiUrl('profile'),
        headers: {
          authorization: `Bearer ${token}`,
        },
      })
      if (response.status == 200) {
        this.profile = response.data
      }
    },
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useBikeTagStore, import.meta.hot))
}
