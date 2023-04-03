import { FlightInfo, FlightDetails } from './types';

function removeTerminals(str: string) {
    if (str.includes("(Terminal 1)")) {
        str = str.replace("(Terminal 1)", "").trim();
    }
    if (str.includes("(Terminal 2)")) {
        str = str.replace("(Terminal 2)", "").trim();
    }
    return str
}

//replacing FlightInfo
export function getEasyJetDetails(html: string): FlightDetails {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
  
    const itinerary = doc.querySelector("#ej-itinerary");
    if (!itinerary) {
      throw new Error("Invalid HTML: Could not find itinerary");
    }
  

    const tds = itinerary.querySelectorAll("td");
    const airports = tds[2]; 
    if (!airports) {
      throw new Error("Invalid HTML: Could not find airports");
    }
  
    const airportsText = airports.textContent?.trim();
    if (!airportsText) {
      throw new Error("Invalid HTML: Could not find airport names");
    }
  
    const airportNames = airportsText.split(" to ");
    if (airportNames.length !== 2) {
      throw new Error("Invalid HTML: Could not parse airport names");
    }
  
    const departureAirport = removeTerminals(airportNames[0].trim());
    const arrivalAirport = removeTerminals(airportNames[1].trim());
  
    console.log(`Departure Airport: ${departureAirport}`);
    console.log(`Arrival Airport: ${arrivalAirport}`);
    
    // const departs = doc.querySelector("td[style*='width:150px'][style*='color:#ffffff']:nth-of-type(2) + td")?.textContent ?? "";
    // const arrives = doc.querySelector("td[style*='width:150px'][style*='color:#ffffff']:nth-of-type(3) + td")?.textContent ?? "";
  
    // console.log('departs is ', departs)
    // console.log('arrives is ', arrives)
    // const departureDateTime = new Date(departs).toISOString();
    // const arrivalDateTime = new Date(arrives).toISOString();
  
    // const durationInMinutes = Math.round((Date.parse(arrivalDateTime) - Date.parse(departureDateTime)) / 1000 / 60);
    // const durationHours = Math.floor(durationInMinutes / 60);
    // const durationMinutes = durationInMinutes % 60;
    // const flightDuration = `${durationHours}h ${durationMinutes}m`;
  
    return {
        from: departureAirport.trim(),
        destination: arrivalAirport.trim(),
        date: '2022-01-01',
        departureTime: '09:00',
        arrivalTime: '22:00',
        airline: {
                 name: 'EasyJet',
                 logo: 'ej.png'
               }
      };
    // return {
    //   departureAirport: departureAirport.trim(),
    //   arrivalAirport: arrivalAirport.trim(),
    //   departureDateTime: '1:00',
    //   arrivalDateTime: '1:00',
    //   flightDuration: '1:00',
    //   airline: {
    //     name: 'EasyJet',
    //     logo: 'klm.png'
    //   }
    // };
  }