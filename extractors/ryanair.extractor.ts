import { parseHTML } from 'linkedom';
import { IFlightDetails } from '../types/airline';

export const getRyanairDetails = (html: any): [boolean, IFlightDetails | undefined] => {
  console.log("ryanair: getRyanairDetails")
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
      departure: {
        dateFormatted: 'hardcoded'
      },
      arrival: {
        dateFormatted: 'hardcoded'
      },
      airline: {
        name: 'Ryanair',
        logo: 'ryanair.png',
        operatorCarrierCode: 'FR'
      },
      emissions: 120,
      flightNumber: 1111,
      aircraft: "A320",
      fromCode: '',
      destinationCode: ''
    };
  } catch(error: unknown) {
    return [false, undefined]
}
};
