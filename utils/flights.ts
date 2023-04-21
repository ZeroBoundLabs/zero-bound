export function parseFlightNumber(flightNumber: string, validCodes: string[]): number | null {
    const codeRegex = new RegExp(`(${validCodes.join('|')})`);
    const numberRegex = /(\d+)/;
  
    const codeMatch = flightNumber.match(codeRegex);
    const numberMatch = flightNumber.match(numberRegex);
  
    if (codeMatch && numberMatch) {
      const number = parseInt(numberMatch[0]);
      return number;
    }
  
    return null;
  }