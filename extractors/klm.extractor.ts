import { parseHTML } from 'linkedom';
import { FlightDetails } from './types';

export const getKlmDetails = (html: any): FlightDetails => {
  const { document } = parseHTML(html);

  try {
    const locationNode = document.querySelector(
      `td[style="font-family:Verdana,Arial,Helvetica,sans-serif;color:#005b82;font-size:13px;font-weight:bold"]`
    )?.textContent;

    if (!locationNode) {
      throw new Error('locationNode is null');
    }
    const locations = locationNode?.trim().split(':')[1].trim();

    let from = locations.split('-')[0].trim();
    let to = locations.split('-')[1].trim();

    const locationCodes = document.querySelectorAll(
      `td[style="padding-top:2px;color:#003145;font-family:Verdana,Arial,Helvetica,sans-serif;font-size:10px"] > strong`
    )[0].textContent;

    if (!locationCodes) {
      throw new Error('locationCodes is null');
    }
    const fromFullName = locationCodes.split('to')[0].trim();
    const toFullName = locationCodes.split('to')[1].trim();

    const codeFrom = fromFullName.split('(')[1].split(')')[0];
    const codeTo = toFullName.split('(')[1].split(')')[0];

    const dateNode = document.querySelectorAll(
      `td[style="font-family:Verdana,Arial,Helvetica,sans-serif;color:#003145;font-size:10px;font-weight:bold"]`
    );

    if (!dateNode[1]?.textContent) {
      throw new Error('dateNode[1] is null');
    }

    const date = dateNode[1].textContent.split('-')[0].trim();

    const timesDepNodes = document.querySelectorAll(
      `td[style="font-family:Verdana,Arial,Helvetica,sans-serif;color:#003145;font-size:10px"]`
    );
    if (!timesDepNodes[1]?.textContent) {
      throw new Error('timesDepNodes[1] is null');
    }
    const departureTime = timesDepNodes[1].textContent.trim().slice(0, 5);

    const timesArrNodes = document.querySelectorAll(
      `td[style="font-family:Verdana,Arial,Helvetica,sans-serif;color:#003145;font-size:10px;border-bottom:1px solid #c2deea"]`
    );

    if (!timesArrNodes[3]?.textContent) {
      throw new Error('timesArrNodes[3] is null');
    }

    const arrivalTime = timesArrNodes[3].textContent.trim().slice(0, 5);

    return {
      from: `${from} (${codeFrom})`,
      destination: `${to} (${codeTo})`,
      date,
      departureTime,
      arrivalTime,
      airline: {
        name: 'KLM',
        logo: 'klm.png'
      }
    };
  } catch (err) {
    console.log(err);
    throw err;
  }
};