// Auth 0 login
import { Game, Tag } from 'biketag/lib/common/schema';
import { defineStore } from 'pinia';
import { biketagGuestClient } from 'src/utils/global';

export const useBikeTagClientStore = defineStore({
  id: 'BiketagClient',
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
        const data = await biketagGuestClient.getGame(undefined, {
          source: 'sanity',
        });
        if (data.success && data.data) {
          const gameData = data.data as unknown as Game[];
          const supportedGames: Game[] = gameData.filter(
            (g: Game) =>
              g.mainhash?.length && g.archivehash?.length && g.queuehash?.length
          );
          this.games = supportedGames;
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
        const data = await biketagGuestClient.getTags(undefined, {
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
