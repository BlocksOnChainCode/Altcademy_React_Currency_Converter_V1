import { useState } from 'react'
import './App.css'

// ! API used, free with 500 calls a day.
// ? https://www.alphavantage.co/documentation/#fx
const apiKey = 'S765H6N4CCK2VPCH'
const url = `https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=USD&to_currency=EUR&apikey=${apiKey}`
let currentRate = 0;


//const symbols = ['USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD', 'CHF', 'CNY', 'HKD', 'NZD', 'SEK', 'SGD', 'ZAR']

function App() {
  // ! useState is a hook that allows us to use state in functional components.
  const [count, setCount] = useState(0)
  const [rate, setRate] = useState(0)
  
  // ? Fetching data from API, setting the rate to the currentRate. State needs to be set to update the DOM.
  // ! State is immutable, so we need to use the setRate function to update the state.
  const apiCall = () => {
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        console.log(data)
        console.log(data['Realtime Currency Exchange Rate']['5. Exchange Rate'])
        currentRate = data['Realtime Currency Exchange Rate']['5. Exchange Rate']
        setRate(currentRate);
      }) 
  } 

  return (
    <div className="App">

      {/* TODO abstract some things into a component later. */}
      <h1>Altcademy React Currency</h1>
      <div className="card">

        {/* ! Keep for syntax reference. for now */}
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <button onClick={apiCall}>Fetch</button>
        <div>
          <p>USD {rate}</p>
          <p>EUR</p>
        </div>

      </div>

    </div>
  )
}

export default App
