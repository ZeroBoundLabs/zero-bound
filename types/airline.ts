export interface Airline {
  name: string;
  logo: string;
  operatorCarrierCode: string;
}
export interface IFlightDetails {
    from: string;
    fromCode: string;
    destination: string;
    destinationCode: string;
    flightNumber: number | null;
    airline: Airline;
    aircraft: string,
    departure: {
      dateFormatted: string;
    };
    arrival: {
      dateFormatted: string;
    };
    emissions: number;
  
  }