import logo from './logo.svg';
import './App.css';
import Axios from 'axios'
import { useEffect, useState } from 'react';
function App() {
  Axios.default.withCredentials = true;
  const [message, setMessage] = useState("");
  useEffect(() => {
    const connect = async () => {
      const response = await Axios.get('https://did-we-sync-dev-157e15cae3f9.herokuapp.com', {
        headers: {
          'Access-Control-Allow-Origin': '*'
        }
      });
      const msg = await response.data;
      setMessage(msg);
    }
    connect();
  })
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          {message}
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
