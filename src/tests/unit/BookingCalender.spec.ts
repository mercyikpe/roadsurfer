import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia } from 'pinia'
import { createRouter, createWebHistory } from 'vue-router'
import BookingCalendar from '@/components/BookingCalendar.vue'
import { ApiService } from '@/services/ApiService'
import type { Station, Booking } from '@/types'

vi.mock('@/services/ApiService')

describe('BookingCalendar', () => {
  const mockStations: Station[] = [
    { id: '1', name: 'Berlin Station' },
    { id: '2', name: 'Hamburg Station' }
  ]

  const mockBookingsBerlin: Booking[] = [
    {
      id: '1',
      customerName: 'John Doe',
      startDate: '2023-08-27T00:00:00Z',
      endDate: '2023-08-29T00:00:00Z',
      pickupReturnStationId: '1'
    }
  ]

  const mockBookingsHamburg: Booking[] = [
    {
      id: '2',
      customerName: 'Jane Smith',
      startDate: '2023-09-01T00:00:00Z',
      endDate: '2023-09-03T00:00:00Z',
      pickupReturnStationId: '2'
    }
  ]

  let router: ReturnType<typeof createRouter>

  beforeEach(() => {
    vi.resetAllMocks()

    router = createRouter({
      history: createWebHistory(),
      routes: [
        { path: '/', component: BookingCalendar },
        {
          path: '/booking/:stationId/:bookingId',
          component: { template: '<div>Booking Details</div>' }
        }
      ]
    })
  })

  it('displays current station name and bookings', async () => {
    vi.mocked(ApiService.getStations).mockResolvedValue(mockStations)
    vi.mocked(ApiService.getBookings).mockResolvedValue(mockBookingsBerlin)

    const wrapper = mount(BookingCalendar, {
      global: {
        plugins: [createPinia(), router]
      }
    })

    await router.isReady()
    await wrapper.vm.$nextTick()

    expect(wrapper.text()).toContain('Current Station: Berlin Station')
    expect(wrapper.text()).toContain('John Doe')
  })

  it('changes week when next and previous buttons are clicked', async () => {
    vi.mocked(ApiService.getStations).mockResolvedValue(mockStations)
    vi.mocked(ApiService.getBookings).mockResolvedValue(mockBookingsBerlin)

    const wrapper = mount(BookingCalendar, {
      global: {
        plugins: [createPinia(), router]
      }
    })

    await router.isReady()
    await wrapper.vm.$nextTick()

    const initialWeekRange = wrapper.find('h2').text()

    // Click next week button
    await wrapper.find('button:last-child').trigger('click')
    await wrapper.vm.$nextTick()
    expect(wrapper.find('h2').text()).not.toBe(initialWeekRange)

    // Click previous week button to go back to the original week
    await wrapper.find('button:first-child').trigger('click')
    await wrapper.vm.$nextTick()
    expect(wrapper.find('h2').text()).toBe(initialWeekRange)
  })

  it('updates bookings when selecting a new station', async () => {
    vi.mocked(ApiService.getStations).mockResolvedValue(mockStations)
    vi.mocked(ApiService.getBookings)
      .mockResolvedValueOnce(mockBookingsBerlin) // First call for Berlin Station
      .mockResolvedValueOnce(mockBookingsHamburg) // Second call for Hamburg Station

    const wrapper = mount(BookingCalendar, {
      global: {
        plugins: [createPinia(), router]
      }
    })

    await router.isReady()
    await wrapper.vm.$nextTick()

    expect(wrapper.text()).toContain('John Doe')

    // Simulate selecting Hamburg Station
    await wrapper.findComponent({ name: 'Autocomplete' }).vm.$emit('selected', mockStations[1])

    await wrapper.vm.$nextTick()
    await new Promise((resolve) => setTimeout(resolve, 0)) // Allow for asynchronous updates

    expect(wrapper.text()).toContain('Jane Smith')
  })
})
