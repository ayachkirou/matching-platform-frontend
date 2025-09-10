/*import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.................
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
*/
import React from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import OffersSection from './components/OffersSection';
import './index.css';


function App() {
  return (
    <div className="App">
      <Header />
      <Hero />
      <OffersSection />
    </div>
  );
}

export default App;