import { defineStore } from 'pinia'
import type { Booking, Station } from '../types'
import { ApiService } from '../services/ApiService'

interface BookingState {
  selectedStation: Station | null
  bookings: Booking[]
  bookingDetails: Booking | null
}

export const useBookingStore = defineStore('booking', {
  state: (): BookingState => ({
    selectedStation: null,
    bookings: [],
    bookingDetails: null
  }),
  actions: {
    setSelectedStation(station: Station) {
      this.selectedStation = station
    },
    setBookings(bookings: Booking[]) {
      this.bookings = bookings
    },
    setBookingDetails(booking: Booking) {
      this.bookingDetails = booking
    },
    async fetchStations(searchQuery: string = '') {
      const stations = await ApiService.getStations(searchQuery)
      if (stations.length > 0) {
        this.setSelectedStation(stations[0])
        await this.fetchBookings(stations[0].id) // Fetch bookings for the first station
      }
    },
    async fetchBookings(stationId: string) {
      const bookings = await ApiService.getBookings(stationId, '', '')
      this.setBookings(bookings)
    },
    async fetchBookingDetails(stationId: string, bookingId: string) {
      const bookingDetails = await ApiService.getBookingDetails(stationId, bookingId)

      // Fetch all stations to find the name of the station for this booking
      const stations = await ApiService.getStations('')
      const matchedStation = stations.find(
        (station) => station.id === bookingDetails.pickupReturnStationId
      )

      this.setBookingDetails({
        ...bookingDetails,
        stationName: matchedStation ? matchedStation.name : 'Unknown Station'
      })
    }
  }
})
