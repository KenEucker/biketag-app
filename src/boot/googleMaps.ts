import { boot } from 'quasar/wrappers';
import * as VueGoogleMaps from 'vue-google-maps-community-fork';

export default boot(({ app }) => {
  app.use(VueGoogleMaps, {
    load: {
      key: 'AIzaSyB4GvwK3dm2L0lAMYL8mbXupW4gxmhABr0',
    },
  });
});
