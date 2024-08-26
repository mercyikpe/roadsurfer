import type { Station, Booking } from '../types'

const BASE_URL = 'https://605c94c36d85de00170da8b4.mockapi.io'

export class ApiService {
  static async getStations(search: string): Promise<Station[]> {
    const response = await fetch(`${BASE_URL}/stations?search=${search}`)
    if (!response.ok) {
      throw new Error('Failed to fetch stations')
    }
    return response.json()
  }

  static async getBookings(
    stationId: string,
    startDate: string,
    endDate: string
  ): Promise<Booking[]> {
    const response = await fetch(
      `${BASE_URL}/stations/${stationId}/bookings?startDate=${startDate}&endDate=${endDate}`
    )
    if (!response.ok) {
      throw new Error('Failed to fetch bookings')
    }
    return response.json()
  }

  static async getBookingDetails(stationId: string, bookingId: string): Promise<Booking> {
    const response = await fetch(`${BASE_URL}/stations/${stationId}/bookings/${bookingId}`)
    if (!response.ok) {
      throw new Error('Failed to fetch booking details')
    }
    return response.json()
  }
}
