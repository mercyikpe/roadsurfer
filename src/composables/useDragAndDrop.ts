import { ref } from 'vue'
import type { Booking } from '@/types'

export function useDragAndDrop(updateLocalBooking: (booking: Booking) => void) {
  const draggedBooking = ref<{ booking: Booking; isStart: boolean; isEnd: boolean } | null>(null)

  const handleDragStart = (bookingEntry: {
    booking: Booking
    isStart: boolean
    isEnd: boolean
  }) => {
    draggedBooking.value = bookingEntry
  }

  const handleDrop = (newDate: string) => {
    if (!draggedBooking.value) return

    const { booking, isStart, isEnd } = draggedBooking.value

    if (isStart) {
      booking.startDate = newDate
    } else if (isEnd) {
      booking.endDate = newDate
    }

    console.log('imaginary API Call:', {
      bookingId: booking.id,
      updatedStartDate: booking.startDate,
      updatedEndDate: booking.endDate
    })

    updateLocalBooking(booking)
    draggedBooking.value = null
  }

  return {
    draggedBooking,
    handleDragStart,
    handleDrop
  }
}
