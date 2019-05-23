import React from 'react';
import logo from './logo.svg';
import './App.css';
import * as MapFactory from './library/mapGeneration.ts';

function App() {
  let x = MapFactory.generateNewMap(50, 30);
  console.log(x);
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
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
