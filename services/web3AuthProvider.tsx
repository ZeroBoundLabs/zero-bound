import { FunctionComponent, ReactNode, createContext, useContext, useEffect, useState } from "react";
import { CHAIN_NAMESPACES, SafeEventEmitterProvider, WALLET_ADAPTERS, ADAPTER_EVENTS } from "@web3auth/base";
import { OpenloginAdapter } from "@web3auth/openlogin-adapter";
import { Web3AuthCore } from '@web3auth/core';
import { WEB3AUTH_NETWORK_TYPE } from "../config/web3AuthNetwork";

const WEB3CLIENT_ID = process.env.NEXT_PUBLIC_WEB3CLIENT_ID;
const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

export interface IWeb3AuthContext {
    web3Auth: Web3AuthCore | null;
    provider: SafeEventEmitterProvider | null;
    isLoading: boolean;
    isLoggedIn: boolean;
    // chain: string;
    user: unknown;
    web3Login: () => Promise<void>;
    logout: () => Promise<void>;
    // getUserInfo: () => Promise<any>;
    // getAccounts: () => Promise<any>;
}

export const Web3AuthContext = createContext<IWeb3AuthContext>({
    web3Auth: null,
    provider: null,
    isLoading: false,
    isLoggedIn: false,
    // chain: "",
    user: null,
    web3Login: async () => {},
    logout: async () => {},
    // getUserInfo: async () => {},
    // getAccounts: async () => {},
  });

export function useWeb3Auth(): IWeb3AuthContext {
    return useContext(Web3AuthContext);
}

interface IWeb3AuthState {
    web3AuthNetwork: WEB3AUTH_NETWORK_TYPE;
    // chain: CHAIN_CONFIG_TYPE;
    children: ReactNode;
}

interface IWeb3AuthProps {
    children?: ReactNode;
    web3AuthNetwork: WEB3AUTH_NETWORK_TYPE;
    // chain: CHAIN_CONFIG_TYPE;
  }

export const Web3AuthProvider: FunctionComponent<IWeb3AuthState> = ({ children, web3AuthNetwork }: IWeb3AuthProps) => {
    const [web3Auth, setWeb3Auth] = useState<Web3AuthCore | null>(null);
    const [provider, setProvider] = useState<SafeEventEmitterProvider | null>(null);
    const [user, setUser] = useState<unknown | null>(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    
    useEffect(() => {
        const subscribeAuthEvents = (web3auth: Web3AuthCore) => {
            web3auth.on(ADAPTER_EVENTS.CONNECTED, (data: unknown) => {
              console.log("Yeah!, you are successfully logged in", data);
              setUser(data);
              setIsLoggedIn(true)
            });
      
            web3auth.on(ADAPTER_EVENTS.CONNECTING, () => { console.log("connecting") });

            web3auth.on(ADAPTER_EVENTS.DISCONNECTED, () => setIsLoggedIn(false));
      
            web3auth.on(ADAPTER_EVENTS.ERRORED, (error) => {
              console.error("some error or user has cancelled login request", error);
            });
        };
                
        async function init() {
            try {
                setIsLoading(true);
                const web3AuthInstance = new Web3AuthCore({
                    clientId: WEB3CLIENT_ID,
                    web3AuthNetwork: web3AuthNetwork,
                    chainConfig: {
                      chainNamespace: CHAIN_NAMESPACES.EIP155,
                      chainId: "0x1",
                    },                     
                })
                
                const adapter = new OpenloginAdapter({ 
                  adapterSettings: { 
                    network: web3AuthNetwork,
                    clientId: WEB3CLIENT_ID,
                    uxMode: "popup",
                    loginConfig: {
                      google: {
                        name: "Carbon Free Login",
                        verifier: 'freenownow-google-testnet',
                        typeOfLogin: 'google',
                        clientId: GOOGLE_CLIENT_ID,
                      },
                    },                    
                  }
                });

                web3AuthInstance.configureAdapter(adapter);
                subscribeAuthEvents(web3AuthInstance)
                setWeb3Auth(web3AuthInstance);
                await web3AuthInstance.init();
            } catch (error) {
                console.log('====>', error)
            } finally {
                setIsLoading(false)
            }
        }

        init();
    }, [web3AuthNetwork])

    const web3Login = async () => {
        if (!web3Auth) {
            console.log("web3auth not initialized yet");
            return;
        }
    
        try {
          const web3authProvider = await web3Auth.connectTo(
            WALLET_ADAPTERS.OPENLOGIN, 
            { loginProvider: 'google' }
          );
        
          setIsLoggedIn(true)
          setProvider(web3authProvider);
      } catch (err: any) {
          console.log(err.message)
      }
    };  
    
    const logout = async () => {
        if (!web3Auth) {
          console.log("web3auth not initialized yet");
          return;
        }

        await web3Auth.logout();
        setIsLoggedIn(false)
        setProvider(null);
    };
          
    const contextProvider = {
        web3Auth,
        provider,
        user,
        isLoading,
        isLoggedIn,
        web3Login,
        logout,
        // getUserInfo,
        // getAccounts,
    };
    
    return <Web3AuthContext.Provider value={contextProvider}>{children}</Web3AuthContext.Provider>
}

