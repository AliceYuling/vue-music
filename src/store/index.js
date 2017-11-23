import Vue from 'vue';
import Vuex from 'vuex';

import * as actions from './actions';
import * as getters from './getters';
import state from './state';
import mutations from './mutations';
import createLogger from 'vuex/dist/logger';         // 修改mutations的记录

Vue.use(Vuex);

const debug = process.env.NODE_ENV !== 'production';   // 线下调试时开启严格模式

export default new Vuex.Store({
  actions,
  getters,
  state,
  mutations,
  strict: debug,
  plugins: debug ? [createLogger()] : []
});
