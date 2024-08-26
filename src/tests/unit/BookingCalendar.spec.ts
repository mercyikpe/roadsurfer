import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia } from 'pinia'
import BookingCalendar from '@/components/BookingCalendar.vue'
import { ApiService } from '@/services/ApiService'
import type { Station, Booking } from '@/types'

vi.mock('@/services/ApiService')

describe('BookingCalendar', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('displays the current station name', async () => {
    const mockStations: Station[] = [
      { id: '1', name: 'Berlin Station' },
      { id: '2', name: 'Hamburg Station' }
    ]
    const mockBookings: Booking[] = []

    vi.mocked(ApiService.getStations).mockResolvedValue(mockStations)
    vi.mocked(ApiService.getBookings).mockResolvedValue(mockBookings)

    const wrapper = mount(BookingCalendar, {
      global: {
        plugins: [createPinia()]
      }
    })

    await wrapper.vm.$nextTick()

    expect(wrapper.text()).toContain('Current Station: Berlin Station')
  })

  it('displays bookings for the current week', async () => {
    const mockStations: Station[] = [{ id: '1', name: 'Berlin Station' }]
    const mockBookings: Booking[] = [
      {
        id: '1',
        customerName: 'John Doe',
        startDate: '2023-04-01T00:00:00Z',
        endDate: '2023-04-05T00:00:00Z',
        pickupReturnStationId: '1'
      }
    ]

    vi.mocked(ApiService.getStations).mockResolvedValue(mockStations)
    vi.mocked(ApiService.getBookings).mockResolvedValue(mockBookings)

    const wrapper = mount(BookingCalendar, {
      global: {
        plugins: [createPinia()]
      }
    })

    await wrapper.vm.$nextTick()

    expect(wrapper.text()).toContain('John Doe')
    expect(wrapper.find('.grid-cols-7').exists()).toBe(true)
  })

  it('changes week when clicking previous and next buttons', async () => {
    const mockStations: Station[] = [{ id: '1', name: 'Berlin Station' }]
    const mockBookings: Booking[] = []

    vi.mocked(ApiService.getStations).mockResolvedValue(mockStations)
    vi.mocked(ApiService.getBookings).mockResolvedValue(mockBookings)

    const wrapper = mount(BookingCalendar, {
      global: {
        plugins: [createPinia()]
      }
    })

    await wrapper.vm.$nextTick()

    const initialWeekRange = wrapper.find('h2').text()

    await wrapper.find('button:first-child').trigger('click') // Previous week
    expect(wrapper.find('h2').text()).not.toBe(initialWeekRange)

    await wrapper.find('button:last-child').trigger('click') // Next week
    expect(wrapper.find('h2').text()).toBe(initialWeekRange)
  })

  it('updates bookings when selecting a new station', async () => {
    const mockStations: Station[] = [
      { id: '1', name: 'Berlin Station' },
      { id: '2', name: 'Hamburg Station' }
    ]
    const mockBookings1: Booking[] = [
      {
        id: '1',
        customerName: 'John Doe',
        startDate: '2023-04-01T00:00:00Z',
        endDate: '2023-04-05T00:00:00Z',
        pickupReturnStationId: '1'
      }
    ]
    const mockBookings2: Booking[] = [
      {
        id: '2',
        customerName: 'Jane Smith',
        startDate: '2023-04-06T00:00:00Z',
        endDate: '2023-04-10T00:00:00Z',
        pickupReturnStationId: '2'
      }
    ]

    vi.mocked(ApiService.getStations).mockResolvedValue(mockStations)
    vi.mocked(ApiService.getBookings)
      .mockResolvedValueOnce(mockBookings1)
      .mockResolvedValueOnce(mockBookings2)

    const wrapper = mount(BookingCalendar, {
      global: {
        plugins: [createPinia()]
      }
    })

    await wrapper.vm.$nextTick()

    expect(wrapper.text()).toContain('John Doe')

    // Simulate selecting a new station
    await wrapper.findComponent({ name: 'Autocomplete' }).vm.$emit('selected', mockStations[1])

    await wrapper.vm.$nextTick()

    expect(wrapper.text()).toContain('Current Station: Hamburg Station')
    expect(wrapper.text()).toContain('Jane Smith')
  })
})
