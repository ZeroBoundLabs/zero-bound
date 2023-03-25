import fs from 'fs'
import { parseHTML } from 'linkedom';
import { FlightDetails } from './types';


export const getRyanairDetails = (html: any): FlightDetails => {
    // fs.writeFileSync('klm.html', html)
    const { document } = parseHTML(html);

    const cityFullNamesNode = document.querySelector(
        'div.gmail_quote > div:nth-child(5) > center > table > tbody > tr > td > table:nth-child(3) > tbody > tr > td > table > tbody > tr > td > center > table > tbody > tr > td > table:nth-child(3) > tbody > tr > td > center > div > table > tbody > tr > td > table > tbody > tr:nth-child(2) > td > table > tbody > tr > td > table > tbody > tr:nth-child(1) > td'
    ) as HTMLElement;

    const [fromLong, destinationLong] = cityFullNamesNode.innerText
        .split('-')
        .map(city => {
            return city
                .trim()
                .split('')
                .filter(char => !['(', ')'].includes(char))
                .join('');
        });

    const cityShortNamesNode = document.querySelector(
        'div.gmail_quote > div:nth-child(5) > center > table > tbody > tr > td > table:nth-child(3) > tbody > tr > td > table > tbody > tr > td > center > table > tbody > tr > td > table:nth-child(3) > tbody > tr > td > center > div > table > tbody > tr > td > table > tbody > tr:nth-child(2) > td > table > tbody > tr > td > table > tbody > tr:nth-child(6) > td'
    ) as HTMLElement;

    const [fromShort, destinationShort] = cityShortNamesNode.innerText
        .split('-')
        .map(city => {
            return city
                .trim()
                .split('')
                .filter(char => !['(', ')'].includes(char))
                .join('');
        });

    const dateNode = document.querySelector(
        'div.gmail_quote > div:nth-child(5) > center > table > tbody > tr > td > table:nth-child(3) > tbody > tr > td > table > tbody > tr > td > center > table > tbody > tr > td > table:nth-child(3) > tbody > tr > td > center > div > table > tbody > tr > td > table > tbody > tr:nth-child(2) > td > table > tbody > tr > td > table > tbody > tr:nth-child(3) > td'
    ) as HTMLElement;
    const date = dateNode.innerText.trim();

    const departureTimeNode = document.querySelector(
        'div.gmail_quote > div:nth-child(5) > center > table > tbody > tr > td > table:nth-child(3) > tbody > tr > td > table > tbody > tr > td > center > table > tbody > tr > td > table:nth-child(3) > tbody > tr > td > center > div > table > tbody > tr > td > table > tbody > tr:nth-child(2) > td > table > tbody > tr > td > table > tbody > tr:nth-child(4) > td > strong'
    ) as HTMLElement;
    const departureTime = departureTimeNode.innerText;

    const arrivalTimeNode = document.querySelector(
        'div.gmail_quote > div:nth-child(5) > center > table > tbody > tr > td > table:nth-child(3) > tbody > tr > td > table > tbody > tr > td > center > table > tbody > tr > td > table:nth-child(3) > tbody > tr > td > center > div > table > tbody > tr > td > table > tbody > tr:nth-child(2) > td > table > tbody > tr > td > table > tbody > tr:nth-child(5) > td > strong'
    ) as HTMLElement;
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
        }
    }
}