import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createWebHistory } from 'vue-router'
import { createPinia, setActivePinia } from 'pinia'
import BookingDetails from '@/components/BookingDetails.vue'
import { useBookingStore } from '@/stores/BookingStore'

vi.mock('@/services/ApiService')

const router = createRouter({
  history: createWebHistory(),
  routes: [{ path: '/booking/:stationId/:bookingId', component: BookingDetails }]
})

describe('BookingDetails.vue', () => {
  it('displays booking details when they are successfully fetched', async () => {
    const pinia = createPinia()
    setActivePinia(pinia)

    const bookingStore = useBookingStore()

    const mockBookingDetails = {
      id: '1',
      customerName: 'John Doe',
      startDate: '2023-04-01T00:00:00Z',
      endDate: '2023-04-05T00:00:00Z',
      stationName: 'Berlin Station',
      pickupReturnStationId: '1'
    }

    // Mock fetchBookingDetails to do nothing (it doesn't need to return data)
    vi.spyOn(bookingStore, 'fetchBookingDetails').mockImplementation(async () => {
      bookingStore.setBookingDetails(mockBookingDetails) // Simulate successful fetch
    })

    const wrapper = mount(BookingDetails, {
      global: {
        plugins: [router, pinia]
      }
    })

    await router.push('/booking/1/1')
    await router.isReady()
    await wrapper.vm.$nextTick() // Wait for the next DOM update cycle

    expect(wrapper.text()).toContain('John Doe')
    expect(wrapper.text()).toContain('Berlin Station')
    expect(wrapper.text()).toContain('4 days')
  })
})
