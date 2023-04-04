import { parseHTML } from 'linkedom';
import { FlightDetails } from './types';

/**
 * To find the parser pieces this is useful:
 * tds.forEach((o, i) => console.log(o.textContent.trim(), i)) then find the data you're looking for and the td index
 * @param html 
 * @returns 
 */
export const getKlmDetails = (html: any): [boolean, FlightDetails | undefined] => {
  console.log('html is ', html)
  
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");

  console.log('in getKlmDetails')
  try {
    let departureDateFormatted, arrivalDateFormatted, departure, destination;
    const tds = doc.querySelectorAll("td");
    
    const travelDates = tds[69].textContent?.trim().replace(/\t/g, '').replace(/\s+/g, ' ');
    if(!travelDates || travelDates?.length === 0) {
      throw new Error("Invalid HTML: travelDates no length")
    }

    const travelDatesArray = travelDates.split(' - ');
    if(travelDatesArray?.length > 0){
      [departureDateFormatted, arrivalDateFormatted] = travelDatesArray
    } else {
      throw new Error("Invalid HTML: Error getting departureDateFormatted and arrivalDateFormatted")
    }
    
    const departDestination = tds ? tds[67].textContent?.trim().replace(/\t/g, '').replace(/\s+/g, ' ').replace(/Flight: /g, '').replace(/ - Return/g, '').split(' - ') : [];

    if (departDestination && departDestination.length > 0) {
      [departure, destination] = departDestination;
    } else {
      throw new Error("Invalid HTML: getting departure and destination")
    }
    
    
    return [true, {
      from: departure,
      destination,
      // date,
      // departureTime,
      // arrivalTime,
      departure: {
        dateFormatted: departureDateFormatted
      },
      arrival: {
        dateFormatted: arrivalDateFormatted
      },
      airline: {
        name: 'KLM',
        logo: 'klm.png'
      }
    }]
  } catch(error: unknown) {
    return [false, undefined]
}
};