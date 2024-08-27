import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import Dashboard from '@/views/Dashboard.vue'
import BookingDetails from '@/components/BookingDetails.vue'

const routes: Array<RouteRecordRaw> = [
  { path: '/', component: Dashboard },
  { path: '/booking/:stationId/:bookingId', component: BookingDetails }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
