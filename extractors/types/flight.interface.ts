import { Airline } from "../../types/airline"

export interface FlightInfo {
    departureAirport: string;
    arrivalAirport: string;
    departureDateTime: string;
    arrivalDateTime: string;
    flightDuration: string;
    airline: Airline;
  }