import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import Dashboard from '@/views/Dashboard.vue'
import BookingDetails from '@/components/BookingDetails.vue'

const routes: Array<RouteRecordRaw> = [
  { path: '/', component: Dashboard },
  { path: '/booking/:stationId/:bookingId', component: BookingDetails }
]

const base = import.meta.env.MODE === 'production' ? 'roadsurfer' : '/'
export default createRouter({
  history: createWebHistory(base),
  routes
})
