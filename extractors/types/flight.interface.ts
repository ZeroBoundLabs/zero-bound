interface Airline {
    name: string
    logo: string
}

export interface FlightDetails {
    from: string
    destination: string
    airline: Airline,
    departure: {
        dateFormatted: string
    },
    arrival: {
        dateFormatted: string
    },
    emissions: number
}

export interface FlightInfo {
    departureAirport: string;
    arrivalAirport: string;
    departureDateTime: string;
    arrivalDateTime: string;
    flightDuration: string;
    airline: Airline;
  }