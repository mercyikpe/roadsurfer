import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia } from 'pinia'
import { createRouter, createWebHistory } from 'vue-router'
import BookingCalendar from '@/components/BookingCalendar.vue'
// import { useBookingStore } from '@/stores/BookingStore'
import type { Station, Booking } from '@/types'
import { ApiService } from '@/services/ApiService'

// Mock the API service
vi.mock('@/services/ApiService', () => ({
  ApiService: {
    getStations: vi.fn(),
    getBookings: vi.fn()
  }
}))

describe('BookingCalendar', () => {
  const mockStations: Station[] = [
    { id: '1', name: 'Berlin Station' },
    { id: '2', name: 'Hamburg Station' }
  ]

  const mockBookings: Booking[] = [
    {
      id: '1',
      customerName: 'John Doe',
      startDate: '2023-08-28T00:00:00Z',
      endDate: '2023-08-30T00:00:00Z',
      pickupReturnStationId: '1'
    }
  ]

  const setupRouter = () => {
    return createRouter({
      history: createWebHistory(),
      routes: [
        { path: '/', component: BookingCalendar },
        {
          path: '/booking/:stationId/:bookingId',
          component: { template: '<div>Booking Details</div>' }
        }
      ]
    })
  }

  it('displays current station name and bookings', async () => {
    vi.resetAllMocks()
    const router = setupRouter()

    // Mock API responses
    vi.mocked(ApiService.getStations).mockResolvedValue(mockStations)
    vi.mocked(ApiService.getBookings).mockResolvedValue(mockBookings)

    const wrapper = mount(BookingCalendar, {
      global: {
        plugins: [createPinia(), router]
      }
    })

    await router.isReady()
    await wrapper.vm.$nextTick()

    expect(wrapper.text()).toContain('Berlin Station')
    expect(wrapper.text()).toContain('John Doe')
  })

  it('changes week when next and previous buttons are clicked', async () => {
    vi.resetAllMocks()
    const router = setupRouter()

    // Mock API responses
    vi.mocked(ApiService.getStations).mockResolvedValue(mockStations)
    vi.mocked(ApiService.getBookings).mockResolvedValue(mockBookings)

    const wrapper = mount(BookingCalendar, {
      global: {
        plugins: [createPinia(), router]
      }
    })

    await router.isReady()
    await wrapper.vm.$nextTick()

    const initialWeekRange = wrapper.find('p.text-xl.font-bold').text()

    // Click next week button
    await wrapper.find('button:last-child').trigger('click')
    await wrapper.vm.$nextTick()
    expect(wrapper.find('p.text-xl.font-bold').text()).not.toBe(initialWeekRange)

    // Click previous week button
    await wrapper.find('button:first-child').trigger('click')
    await wrapper.vm.$nextTick()
    expect(wrapper.find('p.text-xl.font-bold').text()).toBe(initialWeekRange)
  })

  it('updates bookings when searching a new station', async () => {
    vi.resetAllMocks()
    const router = setupRouter()

    // Mock API responses
    vi.mocked(ApiService.getStations).mockResolvedValue(mockStations)
    vi.mocked(ApiService.getBookings).mockResolvedValue(mockBookings)

    const wrapper = mount(BookingCalendar, {
      global: {
        plugins: [createPinia(), router]
      }
    })

    await router.isReady()
    await wrapper.vm.$nextTick()

    // Simulate selecting Hamburg Station
    await wrapper.findComponent({ name: 'Autocomplete' }).vm.$emit('selected', mockStations[1])
    await wrapper.vm.$nextTick()

    expect(vi.mocked(ApiService.getBookings)).toHaveBeenCalledWith(
      mockStations[1].id,
      expect.any(String),
      expect.any(String)
    )
  })
})
