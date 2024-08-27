export interface Station {
  id: string
  name: string
}

export interface Booking {
  id: string
  customerName: string
  startDate: string
  endDate: string
  stationName?: string
  pickupReturnStationId: string
}
