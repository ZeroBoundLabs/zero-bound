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

export interface FlightInfo {
    departureAirport: string;
    arrivalAirport: string;
    departureDateTime: string;
    arrivalDateTime: string;
    flightDuration: string;
    airline: Airline;
  }