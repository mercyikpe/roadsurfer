import { defineStore } from 'pinia'
import type { Station, Booking } from '../types'

interface BookingState {
  selectedStation: Station | null
  bookings: Booking[]
}

export const useBookingStore = defineStore('booking', {
  state: (): BookingState => ({
    selectedStation: null,
    bookings: []
  }),
  actions: {
    setSelectedStation(station: Station) {
      this.selectedStation = station
    },
    setBookings(bookings: Booking[]) {
      this.bookings = bookings
    }
  }
})
