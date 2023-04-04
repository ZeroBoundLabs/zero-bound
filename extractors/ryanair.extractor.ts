import { parseHTML } from 'linkedom';
import { FlightDetails } from './types';

export const getRyanairDetails = (html: any): FlightDetails => {
  const { document } = parseHTML(html);

  try {
    const cityFullNamesNode = document.querySelector(
      `td[style="font-family:Arial,Helvetica,sans-serif,'Roboto';font-size:16px;font-weight:500;letter-spacing:-0.5px;font-weight:bold"]`
    ) as HTMLElement;

    if (!cityFullNamesNode) {
      console.log('cityFullNamesNode is null');
    }
    const [fromLong, destinationLong] = cityFullNamesNode.innerText.split('-').map(city => {
      return city
        .trim()
        .split('')
        .filter(char => !['(', ')'].includes(char))
        .join('');
    });

    const cityShortNamesNode = document.querySelector(
      `td[style="color:#888888;font-size:13px;line-height:19px"]`
    ) as HTMLElement;

    const [fromShort, destinationShort] = cityShortNamesNode.innerText.split('-').map(city => {
      return city
        .trim()
        .split('')
        .filter(char => !['(', ')'].includes(char))
        .join('');
    });

    const dateNode = document.querySelector(
      `td[style="font-family:Arial,Helvetica,sans-serif,'Roboto';font-size:16px;font-weight:500"]`
    ) as HTMLElement;
    const date = dateNode.innerText.trim();

    const timeNodes = document.querySelectorAll(`strong[style="font-size:18px"]`);
    const departureTimeNode = timeNodes[0] as HTMLElement;
    const departureTime = departureTimeNode.innerText;

    const arrivalTimeNode = timeNodes[1] as HTMLElement;
    const arrivalTime = arrivalTimeNode.innerText;

    return {
      from: `${fromLong} (${fromShort})`,
      destination: `${destinationLong} (${destinationShort})`,
      date,
      departureTime,
      arrivalTime,
      airline: {
        name: 'Ryanair',
        logo: 'ryanair.png'
      },
      emissions: emissions
    };
  } catch (err) {
    throw err
  }
};
