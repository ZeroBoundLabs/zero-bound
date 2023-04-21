import { useEffect, useState } from 'react';
import Flights from './flights';
import { useGoogleAuth } from '../providers/googleAuthProvider';
import { getAirportCode, getAirports } from '../utils/airports';
import { Airline, IFlightDetails } from '../types/airline';
import {
  calculateEmissions,
  computeFlightEmissions,
  FlightEmissions,
  getFlightEmissionsApiParams,
  initEmmissions
} from '../utils/emissions';
import IFrame from './iframe';
import Link from 'next/link';
import Header from './header';

const Offset = () => {
  const [messages, setMessages] = useState<Array<IFlightDetails>>([]);
  const [kgsToCompensate, setKgsToCompensate] = useState<number>(0);
  const iframeSrc = 'https://checkout.patch.io/che_prod_d689b666f119cfb86451d1e264150af6/setup/projects';
  const {
    token,
    onLogin,
    isLoggedIn,
    setIsLoading,
    onSignout: onLogout,
    isLoading,
    isGapiLoaded,
    isGsiLoaded,
    listFlightData
  } = useGoogleAuth();

//   useEffect(() => {
//     const init = async () => {
//       if (!isLoggedIn) return;

//       setIsLoading(true);
//       const data = await listFlightData();
//       console.log('data received', data);
//       console.log('data received', data);
//       let airportCodes: string[] = [];

//       data.forEach(flight => {
//         const fromCode = getAirportCode(flight.from);
//         const destinationCode = getAirportCode(flight.destination);

//         if (fromCode && !airportCodes.includes(fromCode)) airportCodes.push(fromCode);
//         if (destinationCode && !airportCodes.includes(destinationCode)) airportCodes.push(destinationCode);
//       });
//       console.log('emm: airportCodes is ', airportCodes);

//       const airports = await getAirports(airportCodes);
//       console.log('emm: airports is ', airports);
//       initEmmissions(airports);

//       const dataWithEmissions: IFlightDetails[] = data.map(flight => {
//         const fromCode: string = getAirportCode(flight.from);
//         const destinationCode: string = getAirportCode(flight.destination);

//         const flightDetails: IFlightDetails = {
//           ...flight,
//           fromCode,
//           destinationCode
//         };

//         //const flightEmissionsApiParams = getFlightEmissionsApiParams(flightDetails);
//         //const flightWithEmissions = await computeFlightEmissions(flightEmissionsApiParams);
//         flightDetails.emissions = calculateEmissions(
//           flightDetails.aircraft,
//           flightDetails.fromCode,
//           flightDetails.destinationCode
//         );

//         return flightDetails;
//       });

//       setMessages(dataWithEmissions);
//       setIsLoading(false);
//     };

//     init();
//   }, [token, isLoggedIn, setIsLoading]);

  if (!isGapiLoaded || !isGsiLoaded) {
    return <></>;
  }

  function compensate() {
    alert('Thanks!');
  }
  return (
    <>
      <Header isLoggedIn={isLoggedIn} onLogin={onLogin} />

      <main className='container mx-auto px-6 mt-5'>
        <div className='flex flex-row'>
          <div className='basis-3/4'>
            
          {isLoading && (
              <div className='fixed inset-0 flex items-center flex-col justify-center bg-black/60 z-10' v-if='loading'>
                <svg height='40' width='40'>
                  <g>
                    <path
                      className='stroke-current text-white/20'
                      d='m 20 5 a 1 1 0 0 0 0 30 a 1 1 0 0 0 0 -30'
                      strokeWidth='3'
                      fill='none'
                      strokeLinecap='round'
                    />
                  </g>
                  <g>
                    <path
                      className='origin-center animate-spin stroke-current text-white'
                      d='m 20 5 c 0 0 15 0 15 15'
                      strokeWidth='3'
                      fill='none'
                      strokeLinecap='round'
                    />
                  </g>
                </svg>
                <span className='text-white font-bold text-xl'>Loading data...</span>
              </div>
            )}

            {!isLoading && (
            //   <Flights
            //     isLoggedIn={isLoggedIn}
            //     messages={messages}
            //     kgsToCompensate={kgsToCompensate}
            //     setKgsToCompensate={setKgsToCompensate}
            //   />
                <div>
                    <h2>You're doing great!</h2>
                    <p>We estimate you have created a total of 3 tonnes with your flights. We recommend you offset with our partners as follows:</p>
                    {/* <IFrame src={iframeSrc} width="600px" height="400px" title="My IFrame" /> */}
                </div>
            )}
           

            
          </div>
          <div className='basis-1/4 m-1'>
            <br />
            <br />
            <br />
            <br />
            <h2 className='text-lg md:text-xl ml-16'>
              {kgsToCompensate}kgs to compensate <br />
               <Link href="/about">Next</Link>
            </h2>
          </div>
        </div>
      </main>
    </>
  );
};

export default Offset;
