import Vue from 'vue';
import App from './App.vue';
import router from '../../router/index-router';
import store from '../../vuex/index';
import axios from '../../api/http/axios';
// import { i18n } from '@/locale';
import 'vuescroll/dist/vuescroll.css';

Vue.config.productionTip = false;
Vue.prototype.axios = axios;

new Vue({
  // i18n,
  router,
  store,
  render: h => h(App),
}).$mount('#app');
