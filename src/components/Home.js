import React from 'react';
import logo from '../images/h2-logo.png';

function Home() {
  return (
    <div className = "h2p-center-flex">
      <img src={logo} className="App-logo" alt="logo" />
      <h1>h2 Prediction League</h1>
      <h3><u>React Application</u></h3>
    </div>
  );
}

export default Home;
