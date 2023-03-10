import { FunctionComponent, ReactNode, createContext, useContext, useState } from "react";
import useScript from "../hooks/use-script";

const CLIENT_ID = process.env.NEXT_PUBLIC_CLIENT_ID;
const API_KEY = process.env.NEXT_PUBLIC_API_KEY;
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
}

export const GoogleAuthContext = createContext<IGoogleAuthContext>({
    token: null,
    isGapiLoaded: false,
    isGsiLoaded: false,
    isLoggedIn: false,
    isLoading: false,
    onLogin: () => {},
    onSignout: () => {},
    setIsLoading: () => {}
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

export const GoogleAuthProvider: FunctionComponent<IWeb3AuthState> = ({ children }: IWeb3AuthProps) => {
    const [tokenClient, setTokenClient] = useState<TokenClient|null>(null)
    const [token, setToken] = useState<GoogleApiOAuth2TokenObject|null>(null);
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
            callback: () => {}
        });

        setTokenClient(token as TokenClient)
        setIsGsiLoaded(true);
    });
    
    const onLogin = () => {
        if (!tokenClient) { return; }

        setIsLoading(true);
        tokenClient.callback = async (resp: any) => {
            if (resp.error !== undefined) {
                throw resp;
            }

            setToken(resp)
            setIsLoggedIn(true);
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
        console.log(token)
        if (token !== null) {
          google.accounts.oauth2.revoke(token.access_token, () => {
            gapi.client.setToken(null);
            setIsLoggedIn(false);
          });
        }
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
    }

    return <GoogleAuthContext.Provider value={contextProvider}>{children}</GoogleAuthContext.Provider>
}