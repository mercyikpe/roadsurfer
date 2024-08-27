import type { Station, Booking } from '../types'
import { handleApiResponse } from '@/utils/errorhandling'

const BASE_URL = 'https://605c94c36d85de00170da8b4.mockapi.io'

export class ApiService {
  static async getStations(search: string): Promise<Station[]> {
    const response = await fetch(`${BASE_URL}/stations?search=${search}`)
    return handleApiResponse<Station[]>(response)
  }

  static async getBookings(
    stationId: string,
    startDate: string,
    endDate: string
  ): Promise<Booking[]> {
    const response = await fetch(
      `${BASE_URL}/stations/${stationId}/bookings?startDate=${startDate}&endDate=${endDate}`
    )
    return handleApiResponse<Booking[]>(response)
  }

  static async getBookingDetails(stationId: string, bookingId: string): Promise<Booking> {
    const response = await fetch(`${BASE_URL}/stations/${stationId}/bookings/${bookingId}`)
    return handleApiResponse<Booking>(response)
  }
}
