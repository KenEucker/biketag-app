import { defineStore, acceptHMRUpdate } from 'pinia'
import BikeTagClient from 'biketag'
import { Game, Tag } from 'biketag/lib/common/schema'

interface TagsFromGames {
  [key: string]: Tag[]
}
interface BikeTagAppState {
  games: Game[]
  tagsFromGames: TagsFromGames
}

const getBikeTagClientConfig = (game?: Game) => {
  const opts: any = {
    game: undefined,
    accessToken: process.env.ACCESS_TOKEN,
    imgur: {
      clientId: process.env.I_CID ?? '',
      clientSecret: process.env.I_CSECRET ?? '',
      refreshToken: process.env.I_RTOKEN ?? '',
    },
    sanity: {
      projectId: process.env.S_PID,
      dataset: process.env.S_DSET,
    },
  }

  if (game) {
    opts.game = game.slug
  }

  return opts
}
const biketagClient = new BikeTagClient(getBikeTagClientConfig())
export const useBikeTagApiStore = defineStore({
  id: 'biketagAppState',
  state: (): BikeTagAppState => ({
    games: [] as Game[],
    tagsFromGames: {} as TagsFromGames
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
            const supportedGames: Game[] = games.filter(
              (g: Game) =>
                g.mainhash?.length &&
                g.archivehash?.length &&
                g.queuehash?.length
            )
            this.games = supportedGames
          }
        })
        .catch((e) => {
          console.log(e)
        })
    },
    async setTagsFromGame(gameName: string) {
      if (this.games.length == 0) {
        await this.setGames()
        const game = this.games.filter(
          (v) => v.name.toLowerCase() === gameName.toLowerCase()
        )[0]
        if (game) {
          return biketagClient
            .getTags(undefined, {
              game: game.name,
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
              game: game.name,
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
    getLogoUrl(
      logo: string,
      size = '',
      sanityBaseCDNUrl = 'https://cdn.sanity.io/images/x37ikhvs/production/'
    ) {
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
          .replace('-jpg', '.jpg')}${size.length ? `?${size}` : ''}`
        : 'https://biketag.io/assets/biketag-logo.svg'
    },
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useBikeTagApiStore, import.meta.hot))
}
