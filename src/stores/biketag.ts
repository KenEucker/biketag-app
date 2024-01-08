// Auth 0 login
import { Game, Tag } from 'biketag/lib/common/schema';
import { defineStore } from 'pinia';
import { biketagClient } from 'src/utils/global';

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
        const data = await biketagClient.getGame(undefined, {
          source: 'sanity',
        });
        if (data.success && data.data) {
          this.games = data.data as unknown as Game[];
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
        const data = await biketagClient.getTags(undefined, {
          game: gameName,
          hash: mainhash,
          source: 'imgur',
        });
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
