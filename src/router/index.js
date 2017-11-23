import Vue from 'vue';
import Router from 'vue-router';
import Recommend from 'components/recommend/recommend.vue';
import Singer from 'components/singer/singer';
import Rank from 'components/rank/rank';
import Search from 'components/search/search';
import SingerDetail from 'components/singer-detail/singer-detail';
import DiscDetail from 'components/disc-detail/disc-detail.vue';
import RankDetail from 'components/rank-detail/rank-detail.vue';
import 'common/style/index.styl';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/recommend'
    },
    {
      path: '/recommend',
      name: 'recommend',
      component: Recommend,
      children: [{
        path: ':id',
        component: DiscDetail
      }]
    },
    {
      path: '/singer',
      name: 'singer',
      component: Singer,
      children: [{
        path: ':id',
        component: SingerDetail
      }]
    },
    {
      path: '/rank',
      name: 'rank',
      component: Rank,
      children: [{
        path: ':id',
        component: RankDetail
      }]
    },
    {
      path: '/search',
      name: 'search',
      component: Search
    }
  ]
});
