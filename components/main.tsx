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
  departure: {
      dateFormatted: string
  },  
  arrivalTime: string
  airline: Airline
  emissions: number
}

const Main = () => {
  const [messages, setMessages] = useState<Array<IFlightInfo>>([]);
  const [kgsToCompensate, setKgsToCompensate] = useState<number>(0);
  
  const {
    token,
    onLogin,
    isLoggedIn,
    setIsLoading,
    onSignout: onLogout,
    isLoading, isGapiLoaded, isGsiLoaded, listFlightData } = useGoogleAuth()

  useEffect(() => {
    const init = async () => {
      if (!isLoggedIn) return;

      setIsLoading(true);
      const data = await listFlightData()

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

  function compensate() {
    alert('Thanks!')
  }
  return (
    <>
      <header className='relative flex h-20 flex-wrap justify-between items-center py-3 px-6 bg-indigo-100 w-full'>
        <img className="absolute left-auto w-16 h-16 top-1" src={'carbon-neutral1.jpg'} alt={'logo'} />
        <div className='space-x-2 absolute right-8 top-2'>
          <button onClick={onLogin}>{isLoggedIn ? 'Change User' : 'Login'}</button>
          {isLoggedIn && (
            <button onClick={onLogout} className='ml-auto'>
              Signout
            </button>
          )}
        </div>
      </header>

      <main className='container mx-auto px-6 mt-5'>
        <div className="flex flex-row"> 
          <div className="basis-3/4">
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

            {!isLoading && (<Flights isLoggedIn={isLoggedIn} messages={messages} kgsToCompensate={kgsToCompensate} setKgsToCompensate={setKgsToCompensate} />)}
          </div>
          <div className="basis-1/4 m-1">
            <br/>
            <br/>
            <br/>
            <br/>
            <h2 className='text-lg md:text-xl ml-16'>{kgsToCompensate}kgs to compensate  <button onClick={compensate}>Let's go</button></h2>
           
          </div>
        </div>
      </main>
    </>
  )
}

export default Main