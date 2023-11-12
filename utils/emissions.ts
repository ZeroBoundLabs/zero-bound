import { IFlightDetails } from '../types/airline';

interface DepartureDate {
  year: number;
  month: number;
  day: number;
}

interface Flight {
  origin: string;
  destination: string;
  operating_carrier_code: string;
  flight_number: number;
  departure_date: DepartureDate;
}
export interface EmissionsGramsPerPax {
  first: number;
  business: number;
  premiumEconomy: number;
  economy: number;
}

export interface FlightEmissions {
  flight: Flight;
  emissionsGramsPerPax: EmissionsGramsPerPax;
}
export function getFlightEmissionsApiParams(flight: IFlightDetails) {
  const origin = flight.fromCode || '?';
  const destination = flight.destinationCode || '?';
  const operating_carrier_code = flight.airline?.operatorCarrierCode || '?';
  // const flight_number = flight.airline?.flight_number || '?';
  const flight_number = flight.flightNumber;
  const dateFromString = new Date(flight.departure?.dateFormatted);
  const departureDateObject: DepartureDate = {
    year:
      dateFromString.getFullYear() < new Date().getFullYear() ? new Date().getFullYear() : dateFromString.getFullYear(),
    month: dateFromString.getMonth() + 1, // Adding 1 because months are 0-indexed
    day: dateFromString.getDate()
  };

  const departure_date = departureDateObject || '?';

  return {
    origin,
    destination,
    operating_carrier_code,
    flight_number,
    departure_date
  };
}

export async function computeFlightEmissions(flights: Flight): Promise<FlightEmissions[] | void> {
  const apiKey = process.env.NEXT_PUBLIC_API_KEY;
  const apiUrl = `https://travelimpactmodel.googleapis.com/v1/flights:computeFlightEmissions?key=${apiKey}`;

  //   const flights: Flight[] = [
  //     {
  //       origin: 'ZRH',
  //       destination: 'CDG',
  //       operating_carrier_code: 'AF',
  //       flight_number: 1115,
  //       departure_date: { year: 2023, month: 11, day: 1 }
  //     },
  //     {
  //       origin: 'CDG',
  //       destination: 'BOS',
  //       operating_carrier_code: 'AF',
  //       flight_number: 334,
  //       departure_date: { year: 2023, month: 11, day: 1 }
  //     },
  //     {
  //       origin: 'ZRH',
  //       destination: 'BOS',
  //       operating_carrier_code: 'LX',
  //       flight_number: 54,
  //       departure_date: { year: 2023, month: 7, day: 1 }
  //     }
  //   ];

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ flights })
    });

    if (response.ok) {
      const data = await response.json();
      const flightEmissions: FlightEmissions[] = data.flightEmissions;

      return flightEmissions;
    } else {
      console.error(`API call failed with status code: ${response.status}`);
    }
  } catch (error) {
    console.error('Error while making API call:', error);
  }
}

interface Airport {
  iata: string;
  lat: number;
  lon: number;
}

interface Aircraft {
  type: string;
  fuelEfficiency: number; // Fuel efficiency in kg of fuel per passenger-km
}

// const airportData: Record<string, Airport> = {
//   JFK: { iata: 'JFK', lat: 40.641311, lon: -73.778139 },
//   LHR: { iata: 'LHR', lat: 51.470022, lon: -0.454295 },
//   PSA: { iata: 'PSA', lat: 43.6874, lon: 10.3948 },
//   BER: { iata: 'BER', lat: 52.3644, lon: 13.5093 },
//   FAO: { iata: 'FAO', lat: 37.0174, lon: 7.9716 }
//   // Add more airports here
// };

let airportData: Record<string, Airport>;

export function initEmmissions(airports: any) {
  console.log('XXX: initEmmissions');
  console.log('initEmmissions: airports', airports);
  airportData = airports.reduce((acc: Record<string, Airport>, airport: any) => {
    acc[airport.iata_code] = {
      iata: airport.iata_code,
      lat: airport.latitude,
      lon: airport.longitude
    };
    return acc;
  }, {});
  console.log('initEmmissions: airportData - is ', airportData);
}

const aircraftData: Record<string, Aircraft> = {
  B738: { type: 'Boeing 737-800', fuelEfficiency: 0.03 },
  A320: { type: 'Airbus A320', fuelEfficiency: 0.031 }
  // Add more aircraft types here
};

function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

function haversine(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export function calculateEmissions(aircraftType: string, origin: string, destination: string): number {
  console.log('XXX: calculateEmissions', airportData);
  const aircraft = aircraftData[aircraftType];
  if (destination === 'FAO') {
    console.log('FAO: hi ');
  }
  if (!aircraft) {
    return 999;
    throw new Error('Invalid aircraft type');
  }

  const originAirport = airportData[origin];
  const destinationAirport = airportData[destination];

  if (!originAirport || !destinationAirport) {
    console.log('emm: airportData is ', airportData)
    console.log('emm: originAirport is ', originAirport, origin)
    console.log('emm: destinationAirport is ', destinationAirport)
    return 998;
    throw new Error(`Invalid origin ${origin} or destination ${destination} `);
  }

  if (destination === 'FAO') {
    console.log('FAO: here ');
  }
  const distance = haversine(originAirport.lat, originAirport.lon, destinationAirport.lat, destinationAirport.lon);
  const emissionsPerKm = aircraft.fuelEfficiency * 3.16; // Conversion factor from kg of fuel to kg CO2e
  const totalEmissions = distance * emissionsPerKm;
  if (destination === 'FAO') {
    console.log('FAO: distance: ', distance);
    console.log('FAO: emissionsPerKm: ', emissionsPerKm);
    console.log('FAO: totalEmissions: ', totalEmissions);
  }
  return Math.round(totalEmissions);
}

// Example usage:
const aircraftType = 'B738';
const origin = 'JFK';
const destination = 'LHR';

try {
  const emissions = calculateEmissions(aircraftType, origin, destination);
  console.log(`Estimated carbon emissions: ${emissions.toFixed(2)} kg CO2e`);
} catch (error: any) {
  console.error(error.message);
}
