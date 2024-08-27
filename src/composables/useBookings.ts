import { ref } from 'vue'
import { useBookingStore } from '@/stores/BookingStore'
import { parseISO, format, min } from 'date-fns'
import type { Station } from '@/types'

export function useBookings() {
  const bookingStore = useBookingStore()
  const errorMessage = ref<string | null>(null)
  const isLoading = ref(false)

  const fetchBookings = async () => {
    if (bookingStore.selectedStation) {
      try {
        await bookingStore.fetchBookings(bookingStore.selectedStation.id)
        const fetchedBookings = bookingStore.bookings
        if (fetchedBookings.length > 0) {
          const dates = fetchedBookings.flatMap((booking) => [
            parseISO(booking.startDate),
            parseISO(booking.endDate)
          ])
          return min(dates)
        }
      } catch (error) {
        console.error('Error fetching bookings:', error)
      }
    }
  }

  const bookingsForDay = (date: string) => {
    return bookingStore.bookings.flatMap((booking) => {
      const bookingStart = format(parseISO(booking.startDate), 'yyyy-MM-dd')
      const bookingEnd = format(parseISO(booking.endDate), 'yyyy-MM-dd')
      const isStart = bookingStart === date
      const isEnd = bookingEnd === date

      const result = []
      if (isStart) {
        result.push({ booking, isStart: true, isEnd: false })
      }
      if (isEnd) {
        result.push({ booking, isStart: false, isEnd: true })
      }
      return result
    })
  }

  const fetchInitialData = async () => {
    isLoading.value = true
    errorMessage.value = null
    try {
      await bookingStore.fetchStations('')
      const earliestDate = await fetchBookings()
      return earliestDate
    } catch (error: any) {
      errorMessage.value = error.message
    } finally {
      isLoading.value = false
    }
  }

  const handleStationSelected = async (station: Station) => {
    bookingStore.setSelectedStation(station)
    await fetchBookings()
  }

  return {
    errorMessage,
    isLoading,
    fetchBookings,
    bookingsForDay,
    fetchInitialData,
    handleStationSelected
  }
}
