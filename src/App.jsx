import { useState } from 'react';
import LiveTimer from './components/LiveTimer';
import WeatherWidget from './components/WeatherWidget';
import ModalButton from './components/ModalButton';
import './App.css';

function App() {
  const [showTimer, setShowTimer] = useState(true);
  const [showWeather, setShowWeather] = useState(true);

  return (
    <div className="app">
      <h1>Погодка</h1>
      
      {showTimer && (
        <LiveTimer onClose={() => setShowTimer(false)} />
      )}
      
      {showWeather && (
        <WeatherWidget onClose={() => setShowWeather(false)} />
      )}
      
      <ModalButton />
    </div>
  );
}

export default App;