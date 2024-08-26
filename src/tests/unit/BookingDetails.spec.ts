import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createWebHistory } from 'vue-router'
import BookingDetails from '@/components/BookingDetails.vue'
import type { Booking } from '@/types'
import { ApiService } from '@/services/api'

vi.mock('@/services/ApiService')

const router = createRouter({
  history: createWebHistory(),
  routes: [{ path: '/booking/:stationId/:bookingId', component: BookingDetails }]
})

describe('BookingDetails', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('displays loading message when booking is null', async () => {
    const wrapper = mount(BookingDetails, {
      global: {
        plugins: [router]
      }
    })

    await router.push('/booking/1/1')
    await router.isReady()

    expect(wrapper.text()).toContain('Loading booking details...')
  })

  it('displays booking details when booking is loaded', async () => {
    const mockBooking: Booking = {
      id: '1',
      customerName: 'John Doe',
      startDate: '2023-04-01T00:00:00Z',
      endDate: '2023-04-05T00:00:00Z',
      pickupReturnStationId: '1'
    }

    vi.mocked(ApiService.getBookingDetails).mockResolvedValue(mockBooking)

    const wrapper = mount(BookingDetails, {
      global: {
        plugins: [router]
      }
    })

    await router.push('/booking/1/1')
    await router.isReady()

    await wrapper.vm.$nextTick()

    expect(wrapper.text()).toContain('John Doe')
    expect(wrapper.text()).toContain('2023-04-01')
    expect(wrapper.text()).toContain('2023-04-05')
    expect(wrapper.text()).toContain('4 days')
    expect(wrapper.text()).toContain('Station ID: 1')
  })

  it('displays error message when fetch fails', async () => {
    vi.mocked(ApiService.getBookingDetails).mockRejectedValue(
      new Error('Failed to fetch booking details')
    )

    const wrapper = mount(BookingDetails, {
      global: {
        plugins: [router]
      }
    })

    await router.push('/booking/1/1')
    await router.isReady()

    await wrapper.vm.$nextTick()

    expect(wrapper.text()).toContain('Error: Failed to fetch booking details')
  })
})
