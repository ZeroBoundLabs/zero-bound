import { IFlightDetails } from '../types/airline';
import { parseFlightNumber } from '../utils/flights';

function removeTerminals(str: string): string {
    const regex = /^(.*) \(Terminal .*\)$/;
    const match = str.match(regex);
    if (match) {
      return match[1]; // return the captured group
    } else {
      return str; // return the original string if there's no match
    }
  }
const isNumeric = (num: any) => (typeof(num) === 'number' || typeof(num) === "string" && num.trim() !== '') && !isNaN(num as number);

function getEmissions(origin: string, destination: string, operatingCarrierCode: string, flightNumber: string, departureDate: string) {
    return 152; //kg
}
//replacing FlightInfo
export function getEasyJetDetails(html: string): [boolean, IFlightDetails | undefined] {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    try {
        const itinerary = doc.querySelector("#ej-itinerary");
        if (!itinerary) {
            throw new Error("Invalid HTML: Could not find itinerary");
        }

        const tds = itinerary.querySelectorAll("td");
        const airports = tds[2]; 
        if (!airports) {
            throw new Error("Invalid HTML: Could not find airports");
        }
        const flightNumberStr = tds[3].textContent?.trim();
        console.log('EasyJet Number: flightNumber is', flightNumberStr)
        console.log('EasyJet Number: > tds[3].textContent is', tds[3].textContent)

        let flightNumber;
        const validEasyjetLabels = ['EZY', 'EZS', 'EJU']
        
        if(flightNumberStr) {
            flightNumber = parseFlightNumber(flightNumberStr, validEasyjetLabels)
            // flightNumberStringSplit = flightNumberStr.trim().split('EZY');
            // if(flightNumberStringSplit.length === 1) {
            //     flightNumberStringSplit = flightNumberStr.trim().split('EZS');
            // }
            // flightNumber = parseInt(flightNumberStr.trim().split('EZY')[1], 10);
            
            // if(!isNumeric(flightNumber)) {
            //     flightNumber = undefined;
            // }
        } else {
            flightNumber = null;
        }
        console.log('EasyJet Number: ', flightNumber)
        const airportsText = airports.textContent?.trim();
        if (!airportsText) {
            throw new Error("Invalid HTML: Could not find airport names");
        }
    
        const airportNames = airportsText.split(" to ");
        if (airportNames.length !== 2) {
            throw new Error("Invalid HTML: Could not parse airport names");
        }
    
        const departureAirport = airportNames[0] ? removeTerminals(airportNames[0].trim()) : undefined;
        const arrivalAirport = airportNames[1] ? removeTerminals(airportNames[1].trim()) : undefined;
    
        if (!departureAirport) {
            throw new Error("Invalid HTML: departureAirport not defined");
        }
        if (!arrivalAirport) {
            throw new Error("Invalid HTML: arrivalAirport not defined");
        }
        
        const departs = tds[9].textContent?.trim();
        const arrives = tds[11].textContent?.trim();
        
        if (!departs) {
            throw new Error("Invalid HTML: departs not defined");
        }
        if (!arrives) {
            throw new Error("Invalid HTML: arrives not defined");
        }

        const departureDate = new Date(departs);
        const arrivalDate = new Date(arrives);

         const departureDateTimeString = departureDate.toISOString();
         const arrivalDateTimeString = arrivalDate.toISOString();
    
         const durationInMinutes = Math.round((Date.parse(arrivalDateTimeString) - Date.parse(departureDateTimeString)) / 1000 / 60);
         const durationHours = Math.floor(durationInMinutes / 60);
         const durationMinutes = durationInMinutes % 60;
         const flightDuration = `${durationHours}h ${durationMinutes}m`;
         const departureDateFormatted = departureDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
         const arrivalDateFormatted = departureDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

         /* {
        "origin": "CDG",
        "destination": "BOS",
        "operating_carrier_code": "AF",
        "flight_number": 334,
        "departure_date": {"year": 2023, "month": 11, "day": 1}
      },*/
        //// dateTime: departureDate,
        
        const emissions = getEmissions('FAO', 'BER', 'EJU', '7544', '22 Apr 2023')
        //operatorCarrierCode = EC, but seems they want U2
        return [true,
            {
            from: departureAirport.trim(),
            destination: arrivalAirport.trim(),
            departure: {
                dateFormatted: departureDateFormatted
            },
            arrival: {
                dateFormatted: arrivalDateFormatted
            },
            airline: {
                name: 'EasyJet',
                logo: 'ej.png',
                operatorCarrierCode: 'U2'
            },
            flightNumber,
            aircraft: "A320",
            emissions: emissions,
            fromCode: '',
            destinationCode: ''
          }];
    } catch(error: unknown) {
        return [false, undefined]
    }
  }