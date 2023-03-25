import { parseHTML } from 'linkedom';
import { FlightDetails } from './types';

export const getLufthansaDetails = (html: any): FlightDetails => {
  const { document } = parseHTML(html);

  try {
    const locations = document.querySelector(
      `td[style="font-family:arial,helvetica,verdana,geneva,sans-serif;font-size:16px;color:#071d49;max-width:100%;white-space:nowrap"] > b > span`
    )?.textContent;

    if (!locations) {
      throw new Error('No locations found');
    }
    let fromLong = locations.split('–')[0].trim();
    let destinationLong = locations.split('–')[1].trim();

    const locationCodes = document.querySelectorAll(
      `td[style="font-family:arial,helvetica,verdana,geneva,sans-serif;font-size:12px;line-height:16px;color:#071d49"]`
    );

    if (!locationCodes[3]?.textContent || !locationCodes[5]?.textContent) {
      throw new Error('No location codes found');
    }

    const fromFull = locationCodes[3].textContent.slice(fromLong.length + 1).split(')')[0] + ')';
    const destinationFull = locationCodes[5].textContent.slice(destinationLong.length + 1).split(')')[0] + ')';

    const dateNode = document.querySelector(
      `td[style="font-family:arial,helvetica,verdana,geneva,sans-serif;font-size:16px;color:#071d49;max-width:100%;white-space:nowrap"] > b`
    );
    if (!dateNode || !dateNode.textContent) {
      throw new Error('No date found');
    }
    const date = dateNode.textContent.split(':')[0];

    const timeNodes = document.querySelectorAll(
      `td[style="font-family:arial,helvetica,verdana,geneva,sans-serif;font-size:12px;line-height:16px;color:#071d49"] > b`
    );

    if (!timeNodes[1]?.textContent || !timeNodes[2]?.textContent) {
      throw new Error('No time found');
    }

    const departureTime = timeNodes[1].textContent.slice(0, 5);
    const arrivalTime = timeNodes[2].textContent.slice(0, 5);

    return {
      from: fromFull,
      destination: destinationFull,
      date,
      departureTime,
      arrivalTime,
      airline: {
        name: 'Lufthansa',
        logo: 'lufthansa.png'
      }
    };
  } catch (err) {
    console.log(err);
    throw err;
  }
};