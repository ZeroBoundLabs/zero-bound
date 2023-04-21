export interface Airline {
  name: string;
  logo: string;
  operatorCarrierCode: string;
}
export interface IFlightDetails {
    from: string;
    fromCode?: string | null ;
    destination: string;
    destinationCode?: string | null ;
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