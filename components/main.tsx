import { useEffect, useState } from "react";
import Flights from "./flights";
import { useGoogleAuth } from "../providers/googleAuthProvider";

interface Airline {
    name: string
    logo: string
}

export interface IFlightInfo {
    from: string
    destination: string
    date: string
    departureTime: string
    arrivalTime: string
    airline: Airline
}

const Main = () => {
    const [messages, setMessages] = useState<Array<IFlightInfo>>([]);

    const {
        token, 
        onLogin, 
        isLoggedIn,
        setIsLoading,
        onSignout: logout, 
        isLoading, isGapiLoaded, isGsiLoaded } = useGoogleAuth()
    
    useEffect(() => {
        const init =async () => {
            if (!isLoggedIn) return;

            setIsLoading(true);
            const accessToken = token?.access_token;
            
            const response = await fetch('/api/gmail', {
                method: 'get',
                headers: {
                  'content-type': 'application/json',
                  'Authorization': `${accessToken}`
                }
              });
            
            if (response.status !== 200) {
                const { message } = await response.json()
                console.log(message);
                setIsLoading(false);
                return;
            }

            const { data } = await response.json()
            setMessages(data);
            setIsLoading(false);
        }

        init()
    }, [token, isLoggedIn, setIsLoading])
/*
    useEffect(() => {
        const init = async () => {
            if(isLoggedIn) {
                const user = await web3Auth?.getUserInfo() as UserInfo
                // console.log(user)
                console.log('oAuthAccessToken ==>', user.oAuthAccessToken)
                const response = await fetch('/api/gmail', {
                    method: 'get',
                    headers: {
                      'content-type': 'application/json',
                      'Authorization': `${user.oAuthAccessToken}`
                    }
                  });
                
                if (response.status !== 200) {
                    const { message } = await response.json()
                    console.log(message);
                    return;
                }

                const { data } = await response.json()
                setMessages(data);                
            }
        }

        init()
    }, [isLoggedIn, web3Auth])
*/
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
                <button onClick={logout} className='ml-auto'>
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

            {!isLoading && (<Flights isLoggedIn={isLoggedIn} messages={messages} />)}
        </main>        
        </>        
    )
}

export default Main