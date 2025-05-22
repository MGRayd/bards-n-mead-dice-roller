import React, { useState } from 'react';

const diceFaces = ['🪙', '🍻', '🎭', '💣', '🐀', '🌈'];

function rollDice(num = 3) {
  return Array.from({ length: num }, () =>
    diceFaces[Math.floor(Math.random() * diceFaces.length)]
  );
}

export default function DiceRoller() {
  const [useExtraDie, setUseExtraDie] = useState(false);
  const [allowReroll, setAllowReroll] = useState(false);

  const [rolledDice, setRolledDice] = useState([]);
  const [finalDice, setFinalDice] = useState([]);
  const [infested, setInfested] = useState(false);
  const [discarding, setDiscarding] = useState(false);
  const [rerolledIndex, setRerolledIndex] = useState(null);

  const handleRoll = () => {
    const count = useExtraDie ? 4 : 3;
    const rolled = rollDice(count);
    setRolledDice(rolled);
    setFinalDice([]);
    setInfested(false);
    setRerolledIndex(null);
    setDiscarding(useExtraDie);
    if (!useExtraDie) {
      setFinalDice(rolled);
      checkInfestation(rolled);
    }
  };

  const handleDiscard = (index) => {
    if (!discarding) return;

    const kept = rolledDice.filter((_, i) => i !== index);
    setFinalDice(kept);
    setDiscarding(false);
    checkInfestation(kept);
  };

  const handleReroll = (index) => {
    if (!allowReroll || rerolledIndex !== null || finalDice.length === 0) return;

    const newDice = [...finalDice];
    newDice[index] = rollDice(1)[0];
    setFinalDice(newDice);
    setRerolledIndex(index);
    checkInfestation(newDice);
  };

  const checkInfestation = (dice) => {
    const ratCount = dice.filter((d) => d === '🐀').length;
    setInfested(ratCount >= 2);
  };

  const renderDice = (diceSet, onClickHandler, highlightIndex) => (
    <div className="dice-row">
      {diceSet.map((face, index) => (
        <span
          key={index}
          className="die"
          style={{
            border: index === highlightIndex ? '2px solid red' : undefined
          }}
          onClick={() => onClickHandler(index)}
        >
          {face}
        </span>
      ))}
    </div>
  );

  return (
    <div className="roller-container">
      <div className="toggle-group">
        <button
          className={`toggle-button ${useExtraDie ? 'active' : ''}`}
          onClick={() => setUseExtraDie((v) => !v)}
        >
          {useExtraDie ? '✅' : '⬜️'} Roll 1 Extra Die
        </button>
        <button
          className={`toggle-button ${allowReroll ? 'active' : ''}`}
          onClick={() => setAllowReroll((v) => !v)}
        >
          {allowReroll ? '✅' : '⬜️'} Allow Re-roll
        </button>

        <button className="roll-button" onClick={handleRoll}>Roll Dice</button>
      </div>

      <div style={{ marginTop: '1rem' }}>
        {discarding ? (
          <>
            <p>Click 1 die to discard:</p>
            {renderDice(rolledDice, handleDiscard)}
          </>
        ) : finalDice.length > 0 ? (
          <>
            <p>
              {allowReroll
                ? 'Click 1 die to re-roll (optional):'
                : 'Your final dice:'}
            </p>
            {renderDice(finalDice, handleReroll, rerolledIndex)}
            {infested && (
              <div className="infested-warning">
                🐀 <strong>Infested!</strong> (2+ Rats)
              </div>
            )}

            <div className="dice-key">
              <h3>Dice Face Meanings</h3>
              <table>
                <tbody>
                  <tr><td>🪙</td><td>Coin – Gain 1 Gold</td></tr>
                  <tr><td>🍻</td><td>Mead Mug – Gain 1 Mead</td></tr>
                  <tr><td>🎭</td><td>Mask – Gain 1 Crowd</td></tr>
                  <tr><td>💣</td><td>Sabotage – Gain 1 Sabotage Token</td></tr>
                  <tr><td>🐀</td><td>Rat – (2+ = Infested)</td></tr>
                  <tr><td>🌈</td><td>Wild – Choose any 1 resource</td></tr>
                </tbody>
              </table>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}
