import { IFlightDetails } from "../types/airline"

interface FlightProps {
  isLoggedIn: boolean,
  messages: IFlightDetails[],
  kgsToCompensate: number,
  setKgsToCompensate: Function
}

const Flights = ({ isLoggedIn, messages, kgsToCompensate, setKgsToCompensate }: FlightProps) => {

  function addToCompensate(emissions: number) {
    setKgsToCompensate(kgsToCompensate + emissions)
  }

  return (
    <>
      <h2 className='text-lg md:text-xl'>Your flights</h2>
      <ul className="list-none">
        {messages.map(
          ({ destination, from, departure, airline, emissions }, key) => (
            <li key={key} className="flex items-center border-t border-gray-300 py-2 relative">
              <img className="w-8 h-8 mr-2" src={airline.logo} alt={airline.name} />
              <div>
                <p className="text-lg ml-2 font-medium">{departure.dateFormatted}</p>
              </div>
              <div className="left-80 absolute" >
                <p className="text-lg font-medium">{from} to {destination}</p>
              </div>
              <div className="left-3/4 absolute" >
                <p className="text-lg font-medium">{emissions ? emissions : '?'}kg</p>
              </div>
              <div className="right-8 absolute" >
                <p className="text-lg font-medium">
                  <button onClick={() => addToCompensate(emissions)}>add</button>
                </p>
              </div>
            </li>
          )
        )}
      </ul>

      {!messages.length && (
        <div className='text-sm text-red-400'>{isLoggedIn ? 'No flight emails found' : 'Please Login...'}</div>
      )}
    </>
  )
}


export default Flights