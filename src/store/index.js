import Vue from 'vue';
import Vuex from 'vuex';
import createLogger from 'vuex/dist/logger';
import modules from './modules';
Vue.use(Vuex);

const store = new Vuex.Store({
  modules,
  plugins: [
    ...process.env.NODE_ENV === 'development' ? [ createLogger() ] : []
  ],
  strict: process.env.NODE_ENV !== 'production'
});

export default store;
