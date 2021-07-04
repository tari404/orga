import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import _Date from '../views/_Date.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/:date(\\d{4}-\\d{2}-\\d{2})',
    name: 'Date',
    component: _Date,
    props: true,
  },
]

const router = new VueRouter({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes,
})

export default router
