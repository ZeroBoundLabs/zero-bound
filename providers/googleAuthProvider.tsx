import { FunctionComponent, ReactNode, createContext, useContext, useState } from "react";
import useScript from "../hooks/use-script";
import { FlightDetails, FlightInfo } from "../extractors/types";
import { getKlmDetails, getLufthansaDetails, getRyanairDetails, getEasyJetDetails } from "../extractors";
import { isEasyJetEmailConfirmation, isKlmEmailConfirmation, isLufthansaEmailConfirmation } from "../extractors/emailIdentifier";
const API_KEY = process.env.NEXT_PUBLIC_API_KEY;
const CLIENT_ID = process.env.NEXT_PUBLIC_CLIENT_ID;
const SCOPES = 'https://www.googleapis.com/auth/gmail.readonly';
const DISCOVERY_DOC = 'https://www.googleapis.com/discovery/v1/apis/gmail/v1/rest';

export interface IGoogleAuthContext {
  token: GoogleApiOAuth2TokenObject | null
  isGapiLoaded: boolean;
  isGsiLoaded: boolean;
  isLoggedIn: boolean;
  isLoading: boolean;
  onLogin: () => void;
  onSignout: () => void;
  setIsLoading: (check: boolean) => void;
  listFlightData: () => Promise<FlightDetails[]>
}

export const GoogleAuthContext = createContext<IGoogleAuthContext>({
  token: null,
  isGapiLoaded: false,
  isGsiLoaded: false,
  isLoggedIn: false,
  isLoading: false,
  onLogin: () => { },
  onSignout: () => { },
  setIsLoading: () => { },
  listFlightData: async (): Promise<FlightDetails[]>  => { return [] }
})

export function useGoogleAuth(): IGoogleAuthContext {
  return useContext(GoogleAuthContext);
}

interface IWeb3AuthState {
  children: ReactNode;
}

interface IWeb3AuthProps {
  children?: ReactNode;
}

interface TokenClient extends google.accounts.oauth2.TokenClient {
  callback: (payload: any) => void
}
//airfrance-klm@connect-passengers.com, noreply@klm.com, 
//KLM Reservations
const fromKey = 'from'
//'Itinerary@ryanair.com'
const airlineSenders = ['noreply@klm.com', 'confirmation@easyJet.com']

const activeAirlines = {
  klm: true,
  easyjet: false,
  lufthansa: false,
  ryanair: false
}
// Phase the below out
const searchKey = 'subject' // subject
const searchTopics = [
  'ryanair',
  'klm',
  'lufthansa',
  // 'Fwd: Confirmation: Berlin - San Francisco (SNJ3IN)',
  // 'Fwd: Booking details | Departure: 08 November 2022 | ZRH-BER'
]
const extractors = {
  klm: getKlmDetails,
  easyjet: getEasyJetDetails
}
export const GoogleAuthProvider: FunctionComponent<IWeb3AuthState> = ({ children }: IWeb3AuthProps) => {
  const [tokenClient, setTokenClient] = useState<TokenClient | null>(null)
  const [token, setToken] = useState<GoogleApiOAuth2TokenObject | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isGapiLoaded, setIsGapiLoaded] = useState(false);
  const [isGsiLoaded, setIsGsiLoaded] = useState(false);


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

    const token = google.accounts.oauth2.initTokenClient({
      client_id: CLIENT_ID!,
      scope: SCOPES,
      callback: () => { }
    });

    setTokenClient(token as TokenClient)
    setIsGsiLoaded(true);
  });

  const onLogin = () => {
    if (!tokenClient) { return; }

    tokenClient.callback = async (resp: any) => {
      if (resp.error !== undefined) {
        throw resp;
      }

      setToken(resp)
      setIsLoggedIn(true);
      setIsLoading(true);
    };

    if (gapi.client.getToken() === null) {
      tokenClient.requestAccessToken({ prompt: 'consent' });
    } else {
      tokenClient.requestAccessToken({ prompt: '' });
    }
  };

  const listFlightData = async (): Promise<FlightDetails[]> => {
    const flights: Array<FlightDetails> = [];

    try {
      
      // Temporarily remove to deploy
      // const query = searchTopics.map(s => `${searchKey}: ${s}`).join(' OR ');
      const query = airlineSenders.map(s => `${fromKey}: ${s}`).join(' OR ');
      console.log('query is ', query)
      //const query = "from: confirmation@easyJet.com"

      const { result: { messages: list } } = await gapi.client.gmail.users.messages.list({
        userId: 'me',
        q: query,
      });

      // console.log(gapi.client.getToken())
      if (list?.length) {
        for (const { id } of list) {
          const { result: { payload } } = await gapi.client.gmail.users.messages.get({
            userId: 'me',
            id: id ?? ''
          });

          if (!payload) continue;

          const data = ((payload?.parts?.length ? payload.parts?.[1]?.body?.data : payload?.body?.data) ?? '')
          
          const decodedBody = Buffer.from(data, 'base64').toString();

          const emailSubject = payload?.headers?.find(header => header?.name?.toLowerCase() === "subject")?.value;
          const emailFrom = payload?.headers?.find(header => header?.name?.toLowerCase() === "from")?.value;
          
          if(emailSubject && emailFrom) {
            const extractor = isKlmEmailConfirmation(emailSubject, emailFrom) && activeAirlines.klm ? extractors['klm'] : isEasyJetEmailConfirmation(emailSubject, emailFrom) && activeAirlines.easyjet ? extractors['easyjet'] : isLufthansaEmailConfirmation(emailSubject, emailFrom) && activeAirlines.lufthansa ? extractors['easyjet'] : undefined;
          
            if(extractor) {
              let [matchedConfirmationTemplate, flightInfo]: [boolean, FlightDetails | undefined] = extractor(decodedBody);

              if (matchedConfirmationTemplate) flights.push(flightInfo as FlightDetails);
            } else {
              // throw new Error(`Could not find an extractor for subject: ${emailSubject}, from: ${emailFrom}`)
            }
          }
        }
      }
    } catch (err) {
      alert((err as Error).message);
    }

    return flights
  }

  const onSignout = () => {
    const token = gapi.client.getToken();
    if (!token) return;

    setIsLoading(true)
    google.accounts.oauth2.revoke(token.access_token, () => {
      gapi.client.setToken(null);
      setIsLoggedIn(false);
      setIsLoading(false)
    });
  };

  const contextProvider = {
    token,
    isGapiLoaded,
    isGsiLoaded,
    isLoggedIn,
    isLoading,
    setIsLoading,
    onLogin,
    onSignout,
    listFlightData,
  }

  return <GoogleAuthContext.Provider value={contextProvider}>{children}</GoogleAuthContext.Provider>
}