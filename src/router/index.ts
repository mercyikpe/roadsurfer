// import { createRouter, createWebHistory } from 'vue-router'
// // import HomeView from '../views/HomeView.vue'
// import Dashboard from '@/views/Dashboard.vue'
// import BookingDetails from '@/components/BookingDetails.vue'

// const router = createRouter({
//   history: createWebHistory(import.meta.env.BASE_URL),
//   routes: [
//     { path: '/', component: Dashboard },
//     { path: '/booking/:stationId/:bookingId', component: BookingDetails }

//     // {
//     //   path: '/',
//     //   name: 'home',
//     //   component: HomeView
//     // }
//     // {
//     //   path: '/about',
//     //   name: 'about',
//     //   // route level code-splitting
//     //   // this generates a separate chunk (About.[hash].js) for this route
//     //   // which is lazy-loaded when the route is visited.
//     //   component: () => import('../views/AboutView.vue')
//     // }
//   ]
// })

// export default router

import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import Dashboard from '../views/Dashboard.vue'
import BookingDetails from '../components/BookingDetails.vue'

const routes: Array<RouteRecordRaw> = [
  { path: '/', component: Dashboard },
  { path: '/booking/:stationId/:bookingId', component: BookingDetails }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
