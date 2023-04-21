import { parseHTML } from 'linkedom';
import { IFlightDetails } from '../types/airline';

/**
 * To find the parser pieces this is useful:
 * tds.forEach((o, i) => console.log(o.textContent.trim(), i)) then find the data you're looking for and the td index
 * @param html
 * @returns
 */
export const getKlmDetails = (html: any): [boolean, IFlightDetails | undefined] => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');

  try {
    let departureDateFormatted, arrivalDateFormatted, departure, destination;
    const tds = doc.querySelectorAll('td');

    const flightNumberRegex = /Flight number:\s*([A-Z]{2}\s*\d+)/;

    const match = tds[72].textContent?.trim().match(flightNumberRegex);

    // console.log('tds72', tds[72].textContent?.trim())
    let flightNumber;

    if (match) {
      console.log('match[1].trim()', match[1].trim())
      console.log('match', match)
      flightNumber = parseInt(match[1].trim().split(' ')[1], 10);
      console.log('>> Flight number:', flightNumber);
    } else {
      console.log('match', match)
      console.log('match tds[72].textContent', tds[72].textContent)
      flightNumber = 0;
      console.log('No flight number found');
    }
    // console.log('tds is ', tds)
    console.log(tds.forEach((o, i) => console.log(o.textContent, i)))
    //todo: This is sometimes - 66 format is "Fri 23 Aug 19 - Sun 8 Sep 19"
    const travelDates = tds[69].textContent?.trim().replace(/\t/g, '').replace(/\s+/g, ' ');
    if (!travelDates || travelDates?.length === 0) {
      throw new Error('Invalid HTML: travelDates no length');
    }

    const travelDatesArray = travelDates.split(' - ');
    if (travelDatesArray?.length > 0) {
      [departureDateFormatted, arrivalDateFormatted] = travelDatesArray;
    } else {
      throw new Error('Invalid HTML: Error getting departureDateFormatted and arrivalDateFormatted');
    }

    //todo: This is sometimes - 64 format is "Flight: Berlin - San Francisco - Return 64"
    const departDestination = tds
      ? tds[67].textContent
          ?.trim()
          .replace(/\t/g, '')
          .replace(/\s+/g, ' ')
          .replace(/Flight: /g, '')
          .replace(/ - Return/g, '')
          .split(' - ')
      : [];
    if (departDestination && departDestination.length > 0) {
      [departure, destination] = departDestination;
    } else {
      throw new Error('Invalid HTML: getting departure and destination');
    }

    return [
      true,
      {
        from: departure,
        destination,
        departure: {
          dateFormatted: departureDateFormatted
        },
        arrival: {
          dateFormatted: arrivalDateFormatted
        },
        flightNumber,
        aircraft: "A320",
        airline: {
          name: 'KLM',
          logo: 'klm.png',
          operatorCarrierCode: 'KL'
        },
        emissions: 120
      }
    ];
  } catch (error: unknown) {
    return [false, undefined];
  }
};
