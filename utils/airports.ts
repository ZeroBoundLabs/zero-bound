interface CityToAirportCode {
  [key: string]: string;
}

const cityToAirportCode: CityToAirportCode = {
  Faro: 'FAO',
  Cancun: 'CUN',
  'Berlin Brandenburg': 'BER',
  'Berlin Schoenefeld': 'SXF',
  'Berlin Tegel': 'TXL',
  'Rome Fiumicino': 'FCO',
  Amsterdam: 'AMS',
  'Lisbon (T2)': 'LIS',
  'Paris Charles de Gaulle (T2B)': 'CDG',
  'Paris Charles de Gaulle': 'CDG',
  Naples: 'NAP',
  Budapest: 'BUD',
  Munich: 'MUC',
  'Tenerife South': 'TFS',
  Geneva: 'GVA',
  Copenhagen: 'CPH',
  'Pisa (Tuscany)': 'PSA',
  Madrid: 'MAD',
  Zurich: 'ZRH'
};

export function getAirportCode(partialCity: string): string {
    if (!cityToAirportCode) {
        throw new Error(`partialCity ${partialCity} not found`)
    }
  return cityToAirportCode[partialCity];
}


/**
 * Gets Airports from the database
 */
export async function getAirports(airportCodes: string[]) {
    try {
        const queryParams = new URLSearchParams({
          iataCodes: JSON.stringify(airportCodes)
        });
    
        const response = await fetch(`/api/hasura?${queryParams.toString()}`);
        if (!response.ok) {
          throw new Error('Failed to fetch data from Hasura.');
        }
        const result = await response.json();

        return result;
        
      } catch (err: any) {
        new Error (err.message);
      }
}
// export function getAirportCode(partialCity: string): string | null {
//     const regex = new RegExp(partialCity, 'i');
//     const foundCity = Object.keys(cityToAirportCode).find(city => regex.test(city));

//     if (foundCity) {
//       const airportCode = cityToAirportCode[foundCity];
//       if (airportCode) {
//         return airportCode.split(',')[0];
//       }
//     }

//     return "????"+partialCity
//   }

// function getAirportCodeOld(partialCity: string): string | null {
//   const regex = new RegExp(partialCity, 'i');
//   const foundCity = Object.keys(cityToAirportCode).find(city => regex.test(city));

//   if (foundCity) {
//     return cityToAirportCode[foundCity];
//   }

//   return "????"+partialCity;

// }

function getAirportCodeFast(city: string): string | null {
  return cityToAirportCode[city] || null;
}
