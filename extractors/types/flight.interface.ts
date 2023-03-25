interface Airline {
    name: string
    logo: string
}

export interface FlightDetails {
    from: string
    destination: string
    date: string
    departureTime: string
    arrivalTime: string
    airline: Airline
}