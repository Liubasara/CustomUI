export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
}

import Vue from 'vue';
import CompositionApi from '@vue/composition-api';
Vue.use(CompositionApi);