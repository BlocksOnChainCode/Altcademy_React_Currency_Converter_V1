import { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMoneyBillTransfer, faSterlingSign, faEuroSign, faYenSign, faDollarSign, faUser, faBuildingColumns } from '@fortawesome/free-solid-svg-icons'
import './App.css'




function App() {
  // ! Hooks are used to manage state in functional components in modern React.
  const [rate, setRate] = useState(0)
  const [baseCurrency, setBaseCurrency] = useState('USD')
  const [quoteCurrency, setQuoteCurrency] = useState('EUR')
  const [amount, setAmount] = useState(1)
  const [converted, setConverted] = useState(0)

  const apiKey = 'S765H6N4CCK2VPCH'
  const url = `https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=${baseCurrency}&to_currency=${quoteCurrency}&apikey=${apiKey}`;
  //const monthly = `https://www.alphavantage.co/query?function=FX_MONTHLY&from_symbol=USD&to_symbol=EUR&apikey=${apiKey}`

  useEffect(() => {
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        console.log(data)
        console.log(data['Realtime Currency Exchange Rate']['5. Exchange Rate'])
        const currentRate = parseFloat(data['Realtime Currency Exchange Rate']['5. Exchange Rate']).toFixed(3);
        
        setRate(currentRate);
        setConverted(currentRate * amount)
      }) 
  }, [baseCurrency, quoteCurrency]);

  const convert = (e) => { 
    const amount = e.target.value;
    const convertedAmount = (amount * rate).toFixed(2);
    setAmount(amount)
    setConverted(convertedAmount)
  }

  return (
    <div className="App">
      <h1>Altcademy React Currency</h1>
      <h2>{baseCurrency}/{quoteCurrency} {rate}</h2>
      
    <>
      <div className="card">
        <select name='base-currency' id='base-currency' value={baseCurrency} onChange={(e) => setBaseCurrency(e.target.value)}>
          <option value="USD">USD</option>
          <option value="EUR">EUR</option>
          <option value="GBP">GBP</option> 
          <option value="JPY">JPY</option> 
          <option value="BTC">BTC</option>
        </select>

        <FontAwesomeIcon icon={faUser} />
        <FontAwesomeIcon icon={faMoneyBillTransfer} className="exchange-icon" />
        <FontAwesomeIcon icon={faBuildingColumns} />

        <select name="quote-currency" id="quote-currency" value={quoteCurrency} onChange={(e) => setQuoteCurrency(e.target.value)}>
          <option value="USD">USD</option>
          <option value="EUR">EUR</option>
          <option value="GBP">GBP</option>
          <option value="JPY">JPY</option>
          <option value="BTC">BTC</option> 
        </select>
      </div>
      <div className="result">
        <p>
          <span className="currency">{quoteCurrency} </span>
          <span className="amount">{converted}</span>
        </p>
      </div>
      <div className='input-wrapper'>
        <input type="number" value={amount} onChange={convert}/>
      </div>
    </>
    </div>
  )
}

export default App

/**
 * ! api used: https://www.alphavantage.co/documentation/
 * 
 * todo: Add a dropdown to select the currency you want to convert to. [DONE]
 * todo: use Chart.js to display a graph of the exchange rate over the last 30 days. [PENDING]
 * todo: make the dollar bill clickable to swap the currencies. [PENDING]
 * 
 * ? docs for React hooks: https://reactjs.org/docs/hooks-intro.html
 * ? docs for React icons: https://fontawesome.com/how-to-use/on-the-web/using-with/react
 * ? docs for React useEffect: https://reactjs.org/docs/hooks-effect.html
 * ? docs for React useState: https://reactjs.org/docs/hooks-state.html
 * 
 * TODO: Ask david about how to safeguard the api key, when I can't use .env like I would in a NodeJs app.
 */
