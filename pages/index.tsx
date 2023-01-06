import { useState } from 'react';
import useScript from '../hooks/use-script';

const CLIENT_ID = process.env.NEXT_PUBLIC_CLIENT_ID;
const API_KEY = process.env.NEXT_PUBLIC_API_KEY;
const SCOPES = 'https://www.googleapis.com/auth/gmail.readonly';
const DISCOVERY_DOC = 'https://www.googleapis.com/discovery/v1/apis/gmail/v1/rest';

let tokenClient: any;

const formatDate = (d: string) => {
  const date = new Date(d);

  const year = date.getFullYear(),
    month = date.getMonth() + 1,
    day = date.getDate(),
    hour = date.getHours(),
    minute = date.getMinutes(),
    hourFormatted = hour % 12 || 12,
    minuteFormatted = minute < 10 ? '0' + minute : minute,
    morning = hour < 12 ? 'AM' : 'PM';

  return month + '/' + day + '/' + year + ' ' + hourFormatted + ':' + minuteFormatted + morning;
};

export default function Home() {
  const [isGapiLoaded, setIsGapiLoaded] = useState(false);
  const [isGsiLoaded, setIsGsiLoaded] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Array<any>>([]);

  useScript('https://apis.google.com/js/api.js', () => {
    gapi.load('client', async () => {
      if (isGapiLoaded) {
        return;
      }
      await gapi.client
        .init({
          apiKey: API_KEY,
          discoveryDocs: [DISCOVERY_DOC]
        })
        .catch((err: any) => {
          console.error('Caught error', err);
        });

      setIsGapiLoaded(true);
    });
  });

  useScript('https://accounts.google.com/gsi/client', () => {
    if (isGsiLoaded) {
      return;
    }

    tokenClient = google.accounts.oauth2.initTokenClient({
      client_id: CLIENT_ID!,
      scope: SCOPES,
      callback: () => {}
    });

    setIsGsiLoaded(true);
  });

  const listLabels = async () => {
    const msgs: Array<any> = [];

    try {
      const {
        result: { messages: list }
      } = await gapi.client.gmail.users.messages.list({
        userId: 'me',
        q: 'label: travel'
      });

      console.dir(list, { depth: null });
      if (list?.length) {
        for (const { id } of list) {
          const {
            result: { payload }
          } = await gapi.client.gmail.users.messages.get({
            userId: 'me',
            id: id ?? ''
          });
          console.dir(payload, { depth: null });
          const htmlDoc = document.createElement('div');
          htmlDoc.innerHTML = decodeURIComponent(
            escape(
              atob(
                ((payload?.parts?.length ? payload.parts?.[1]?.body?.data : payload?.body?.data) ?? '')
                  .replaceAll('-', '+')
                  .replaceAll('_', '/')
              )
            )
          );

          const script = htmlDoc.querySelector('script[type="application/ld+json"]')?.textContent;

          if (script && JSON.parse(script)['@type']) {
            const parsed = JSON.parse(script);

            if (parsed['@type'] === 'FlightReservation') {
              msgs.push(parsed);
            }
          }
        }

        setMessages(msgs);
      }
    } catch (err) {
      alert((err as Error).message);
    }
  };

  const onLogin = () => {
    setIsLoading(true);
    setMessages([]);
    tokenClient.callback = async (resp: any) => {
      if (resp.error !== undefined) {
        throw resp;
      }
      setIsLoggedIn(true);
      await listLabels();
      setIsLoading(false);
    };

    if (gapi.client.getToken() === null) {
      tokenClient.requestAccessToken({ prompt: 'consent' });
    } else {
      tokenClient.requestAccessToken({ prompt: '' });
    }
  };

  const onSignout = () => {
    const token = gapi.client.getToken();
    if (token !== null) {
      google.accounts.oauth2.revoke(token.access_token, () => {
        gapi.client.setToken(null);
        setIsLoggedIn(false);
        setMessages([]);
      });
    }
  };

  if (!isGapiLoaded || !isGsiLoaded) {
    return <></>;
  }

  return (
    <>
      <header className='flex flex-wrap justify-between items-center py-3 px-6 bg-indigo-100 w-full'>
        <h1 className='text-xl md:text-3xl font-bold md:font-normal'>Gmail Flight Reservations</h1>
        <div className='space-x-2'>
          <button onClick={onLogin}>{isLoggedIn ? 'Change User' : 'Login'}</button>
          {isLoggedIn && (
            <button className='ml-auto' onClick={onSignout}>
              Signout
            </button>
          )}
        </div>
      </header>

      <main className='container mx-auto px-6 mt-5'>
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
          <>
            <h2 className='text-lg md:text-xl'>Flight Reservations</h2>
            {messages.map(
              ({
                underName: { name },
                reservationFor: {
                  flightNumber,
                  airline: { name: airlineName },
                  departureAirport: { name: departureAirportName, iataCode: departureAirportIataCode },
                  departureTime,
                  arrivalAirport: { name: arrivalAirportName, iataCode: arrivalAirportIataCode },
                  arrivalTime
                },
                reservationNumber,
                reservationStatus
              }) => (
                <div
                  className='card border-2 border-indigo-400 my-4 w-full grid grid-cols-1 lg:grid-cols-3 gap-[1px]'
                  key={reservationNumber}
                >
                  <div>
                    <div>
                      <span className='font-medium'>Name:</span> {name}
                    </div>
                    <div>
                      <span className='font-medium'>Flight Number:</span> {flightNumber}
                    </div>
                    <div>
                      <span className='font-medium'>Airline:</span> {airlineName}
                    </div>
                    <div>
                      <span className='font-medium'>Reservation Number:</span> {reservationNumber}
                    </div>
                    <div>
                      <span className='font-medium'>Reservation Status:</span>{' '}
                      {reservationStatus.replace('http://schema.org/', '')}
                    </div>
                  </div>
                  <hr className='border-indigo-400 border-t-2 lg:hidden my-3' />
                  <div>
                    <span className='font-medium'>Departure</span>
                    <ul>
                      <li>- {departureAirportName}</li>
                      <li>- {departureAirportIataCode}</li>
                      <li>- {formatDate(departureTime)}</li>
                    </ul>
                  </div>
                  <hr className='border-indigo-400 border-t-2 lg:hidden my-3' />
                  <div>
                    <span className='font-medium'>Arrival</span>
                    <ul>
                      <li>- {arrivalAirportName}</li>
                      <li>- {arrivalAirportIataCode}</li>
                      <li>- {formatDate(arrivalTime)}</li>
                    </ul>
                  </div>
                </div>
              )
            )}

            {!messages.length && (
              <div className='text-sm text-red-400'>{isLoggedIn ? 'No flight emails found' : 'Please Login...'}</div>
            )}
          </>
        )}
      </main>
    </>
  );
}
