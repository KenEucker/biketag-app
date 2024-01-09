// Auth 0 login
import { Game, Tag } from 'biketag/lib/common/schema';
import { defineStore } from 'pinia';
import { biketagClient, biketagGuestClient } from 'src/utils/global';
import { useAuthStore } from './auth';

export const useBikeTagStore = defineStore({
  id: 'Biketag',
  state: () => ({
    games: [] as Game[],
    gamesTag: [] as Tag[],
    loader: false as boolean,
  }),
  getters: {
    getGames: (state) => state.games || null,
    getGamesTag: (state) => state.gamesTag || null,
    getGamesLoader: (state) => state.loader || false,
  },
  actions: {
    async fetchGamesList() {
      this.loader = true;
      try {
        let data = null;
        // check user is logged in
        if (useAuthStore().getIsAuthenticated) {
          // get logged in user game data
          data = await biketagClient.getGame(undefined, {
            source: 'sanity',
          });
        } else {
          // get guest user game data
          data = await biketagGuestClient.getGame(undefined, {
            source: 'sanity',
          });
        }
        if (data.success && data.data) {
          if (useAuthStore().getIsAuthenticated) {
            // set logged in user game data
            this.games = data.data as unknown as Game[];
          } else {
            // set guest user game data
            const gameData = data.data as unknown as Game[];
            const supportedGames: Game[] = gameData.filter(
              (g: Game) =>
                g.mainhash?.length &&
                g.archivehash?.length &&
                g.queuehash?.length
            );
            this.games = supportedGames;
          }
        }
      } catch (error) {
        console.log(error);
      } finally {
        this.loader = false;
      }
    },
    async fetchTagsList(gameName: string, mainhash: string) {
      this.loader = true;
      try {
        let data = null;
        // check user is logged in
        if (useAuthStore().getIsAuthenticated) {
          // get logged in user tag data
          data = await biketagClient.getTags(undefined, {
            game: gameName,
            hash: mainhash,
            source: 'imgur',
          });
        } else {
          // get guest user tag data
          data = await biketagGuestClient.getTags(undefined, {
            game: gameName,
            hash: mainhash,
            source: 'imgur',
          });
        }
        if (data.success && data.data) {
          this.gamesTag = data.data as unknown as Tag[];
        }
      } catch (error) {
        console.log(error);
      } finally {
        this.loader = false;
      }
    },
  },
});
