import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMoneyBillTransfer } from '@fortawesome/free-solid-svg-icons'
import './App.css'



function App() {
  // ! useState is a hook that allows us to use state in functional components.
  const [rate, setRate] = useState(0)
  
  // ! Will have to set the state based on the select tag.
  const [baseCurrency, setBaseCurrency] = useState('USD')
  const [quoteCurrency, setQuoteCurrency] = useState('EUR')
  const [amount, setAmount] = useState(0)

  // ! API used, free with 500 calls a day.
  // ? https://www.alphavantage.co/documentation/#fx
  const apiKey = 'S765H6N4CCK2VPCH'
  const url = `https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=USD&to_currency=EUR&apikey=${apiKey}`
  const monthly = `https://www.alphavantage.co/query?function=FX_MONTHLY&from_symbol=USD&to_symbol=EUR&apikey=${apiKey}`
  let currentRate = 0;
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

  // ! This function will be called when the input is changed.
  const convert = (e) => {
    //e.preventDefault();
    // ? Always place the value in a variable, and then set the state.
    const amount = e.target.value;
    setAmount(amount)
    console.log(amount)
  }

  return (
    <div className="App">

      {/* //TODO abstract some things into a component later. */}
      {/* Header.... */}
      <h1>Altcademy React Currency</h1>
      <h2>USD/EUR {rate}</h2>
      
    <>
      <div className="card">
        <select name='base-currency' id='base-currency'>
          <option value="USD">USD</option>
          <option value="EUR">EUR</option>
          <option value="GBP">GBP</option>
          <option value="JPY">JPY</option>
          <option value="BTC">BTC</option>
          <option value="AU">AU</option>
          <option value="AG">AG</option>
        </select>
        <FontAwesomeIcon icon={faMoneyBillTransfer} />
        <select name="quote-currency" id="quote-currency">
          <option value="USD">USD</option>
          <option value="EUR">EUR</option>
          <option value="GBP">GBP</option>
          <option value="JPY">JPY</option>
          <option value="BTC">BTC</option>
          <option value="AU">AU</option>
          <option value="AG">AG</option>
        </select>
      </div>
      <div>
        <input type="number" value={amount} onChange={convert}/>
        <button onClick={apiCall}>Fetch</button>
      </div>
        
        

    </>
      {/* Selection/ main content */}
      {/* Side bar */}
      {/* Footer */}
    </div>
  )
}

export default App

// todo: Side bar for current rates, and a graph of the last 30 days.
// todo: Add a search bar to search for different currencies?
// todo: Add a dropdown to select the currency you want to convert to.