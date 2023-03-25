import { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMoneyBillTransfer,
  faUser,
  faBuildingColumns,
} from "@fortawesome/free-solid-svg-icons";
import Chart from "chart.js/auto";
import "./App.css";

const Header = (props) => {
  return (
    <header>
      <h1>Altcademy React Currency Converter</h1>
      <h2>
        {props.baseCurrency}/{props.quoteCurrency} {props.rate}
      </h2>
    </header>
  );
};

const Card = (props) => {
  return (
    // ! React Fragments are used to group a list of children without adding extra nodes to the DOM.
    // ? [@...DAVID], is there some sort of convention for when to NOT use a fragment?
    <>
      <div className="card">
        <select
          name="base-currency"
          id="base-currency"
          value={props.baseCurrency}
          onChange={(e) => props.setBaseCurrency(e.target.value)}
        >
          <option value="USD">USD</option>
          <option value="EUR">EUR</option>
          <option value="GBP">GBP</option>
          <option value="JPY">JPY</option>
        </select>

        <FontAwesomeIcon icon={faUser} />

        {/* onClick of fontawesome icon swap states of base and quote currency */}
        <FontAwesomeIcon
          icon={faMoneyBillTransfer}
          className="exchange-icon"
          onClick={() => {
            props.setBaseCurrency(props.quoteCurrency);
            props.setQuoteCurrency(props.baseCurrency);
          }}
        />

        <FontAwesomeIcon icon={faBuildingColumns} />

        <select
          name="quote-currency"
          id="quote-currency"
          value={props.quoteCurrency}
          onChange={(e) => setQuoteCurrency(e.target.value)}
        >
          <option value="USD">USD</option>
          <option value="EUR">EUR</option>
          <option value="GBP">GBP</option>
          <option value="JPY">JPY</option>
        </select>
      </div>
    </>
  );
};

const Result = (props) => {
  return (
    <div className="result">
      <p>
        <span className="currency">{props.quoteCurrency} </span>
        <span className="amount">{props.converted}</span>
      </p>
    </div>
  );
};

const Input = (props) => {
  return (
    <div className="input-wrapper">
      <input type="number" value={props.amount} onChange={props.convert} />
    </div>
  );
};

const ChartComponent = (props) => {
  return (
    <div className="chart-wrapper">
      <canvas ref={props.chartRef} />
    </div>
  );
};

function App() {
  // ! Hooks are used to manage state in functional components in modern React.
  const [rate, setRate] = useState(0);
  const [baseCurrency, setBaseCurrency] = useState("USD");
  const [quoteCurrency, setQuoteCurrency] = useState("EUR");
  const [amount, setAmount] = useState(1);
  const [converted, setConverted] = useState(0);
  const [historicalData, setHistoricalData] = useState(null);
  const chartRef = useRef(null);

  // ! free api key from alphavantage.co
  const apiKey = "S765H6N4CCK2VPCH";
  const exchangeRateUrl = `https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=${baseCurrency}&to_currency=${quoteCurrency}&apikey=${apiKey}`;
  const monthly = `https://www.alphavantage.co/query?function=FX_MONTHLY&from_symbol=${baseCurrency}&to_symbol=${quoteCurrency}&apikey=${apiKey}`;

  // ? useEffect is used to run code when the component mounts and when the component updates.
  // ? useEffect takes a callback function and an array of dependencies.

  const fetchExchangeRate = () => {
    fetch(exchangeRateUrl)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        console.log(
          data["Realtime Currency Exchange Rate"]["5. Exchange Rate"]
        );
        const currentRate = parseFloat(
          data["Realtime Currency Exchange Rate"]["5. Exchange Rate"]
        ).toFixed(3);

        setRate(currentRate);
        setConverted(currentRate * amount);
      });
  };

  const fetchHistoricalData = () => {
    fetch(monthly)
      .then((response) => response.json())
      .then((data) => {
        const prices = Object.entries(data["Time Series FX (Monthly)"]).map(
          (entry) => {
            const [date, prices] = entry;
            return { x: date, y: parseFloat(prices["4. close"]) };
          }
        );
        console.log(prices);
        setHistoricalData(prices);
      });
  };

  useEffect(() => {
    fetchExchangeRate();
    fetchHistoricalData();
  }, [baseCurrency, quoteCurrency]);

  useEffect(() => {
    let chartInstance = null;
    if (chartRef.current && historicalData) {
      // destroy existing chart instance
      if (chartInstance) {
        chartInstance.destroy();
      }
      chartInstance = new Chart(chartRef.current, {
        type: "line",
        data: {
          datasets: [
            {
              label: `${baseCurrency}/${quoteCurrency}`,
              data: historicalData.reverse().map((dataPoint) => {
                return { x: dataPoint.x, y: dataPoint.y };
              }),
            },
          ],
        },
        options: {},
      });
    }
    return () => {
      // destroy chart instance on unmount
      if (chartInstance) {
        chartInstance.destroy();
      }
    };
  }, [chartRef, historicalData, baseCurrency, quoteCurrency]);

  const convert = (e) => {
    const amount = e.target.value;
    const convertedAmount = (amount * rate).toFixed(2);
    setAmount(amount);
    setConverted(convertedAmount);
  };

  return (
    <div className="App">
      <>
        <Header
          baseCurrency={baseCurrency}
          quoteCurrency={quoteCurrency}
          rate={rate}
        />
        <main>
          <Card
            baseCurrency={baseCurrency}
            setBaseCurrency={setBaseCurrency}
            quoteCurrency={quoteCurrency}
            setQuoteCurrency={setQuoteCurrency}
          />
          <Result quoteCurrency={quoteCurrency} converted={converted} />
          <Input amount={amount} convert={convert} />
          <ChartComponent chartRef={chartRef} />
        </main>
      </>
    </div>
  );
}

export default App;

/**
 * ! api used: https://www.alphavantage.co/documentation/
 *
 * todo: Add a dropdown to select the currency you want to convert to. [DONE]
 * todo: use Chart.js to display a graph of the exchange rate over the last 30 days. [SEMI DONE] (need to fix the chart for btc) [DONE] ( removed BTC as to not use different API )
 * todo: make the dollar bill clickable to swap the currencies. [PENDING]
 * todo: ensure the dates on the chart are correct. [PENDING]
 *
 * ? docs for React hooks: https://reactjs.org/docs/hooks-intro.html
 * ? docs for React icons: https://fontawesome.com/how-to-use/on-the-web/using-with/react
 * ? docs for React useEffect: https://reactjs.org/docs/hooks-effect.html
 * ? docs for React useState: https://reactjs.org/docs/hooks-state.html
 * ? docs for React useRef: https://reactjs.org/docs/hooks-reference.html#useref
 * ? docs for react fontAweosme: https://fontawesome.com/how-to-use/on-the-web/using-with/react
 * ? docs for charts.js: https://www.chartjs.org/docs/latest/
 *
 * TODO: Ask david about how to safeguard the api key, when I can't use .env like I would in a NodeJs app. [@...David...]
 */
