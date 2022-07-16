import Home from './views/Home.vue'
import NotFound from './views/NotFound.vue'
import Query from "./views/Query.vue";
import Principle from "./views/Principle.vue";

/** @type {import('vue-router').RouterOptions['routes']} */
export let routes = [
  { path: '/', component: Home, meta: { title: '證書查詢系統' } },
  { path: '/principle', component: Principle, meta: { title: '原理' } },
  { path: '/query', component: Query, meta: { title: '查詢結果' }, invisible: true },
  { path: '/:path(.*)', component: NotFound, invisible: true },
]
