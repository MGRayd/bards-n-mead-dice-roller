import React from 'react';
import DiceRoller from './components/DiceRoller';

function App() {
  return (
    <div className="App">
      <img
        src={`${process.env.PUBLIC_URL}/bards-n-mead-logo.png`}
        alt="Bards 'n Mead Logo"
        className="logo-image"
      />

      <div className="content-area">
        <DiceRoller />
      </div>
    </div>
  );
}

export default App;