import { IFlightInfo } from "./main";

interface FlightProps {
  isLoggedIn: boolean,
  messages: IFlightInfo[]
}

const Flights = ({ isLoggedIn, messages }: FlightProps) => {

    return (
        <>                   
        <h2 className='text-lg md:text-xl'>Flight Reservations</h2>
        <ul className="list-none">
        {messages.map(
          ({ destination, from, date, departureTime, arrivalTime, airline  }, key) => (
            <li key={key} className="flex items-center border-t border-gray-300 py-2">
              <img className="w-8 h-8 mr-2" src={airline.logo} alt={airline.name} />
              <div>
                <p className="text-lg font-medium">{airline.name}</p>
                <p className="text-sm text-gray-600">{date}</p>
              </div>
              <div className="ml-auto text-right">
                <p className="text-lg font-medium">{destination}</p>
                <p className="text-sm text-gray-600">to {from}</p>
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