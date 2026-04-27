import { useState, useEffect, useRef } from 'react';
import './LiveTimer.css';

function LiveTimer({ onClose }) {
  const [time, setTime] = useState(3599); 
  const [isRunning, setIsRunning] = useState(true);
  const [isExpired, setIsExpired] = useState(false);
  const intervalRef = useRef(null);

  const formatTime = (seconds) => {
    if (isExpired) return 'таймер истёк';
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  useEffect(() => {
    if (isRunning && !isExpired && time > 0) {
      intervalRef.current = setInterval(() => {
        setTime(prev => {
          if (prev <= 1) {
            setIsExpired(true);
            setIsRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, isExpired]);

  const stopTimer = () => {
    setIsRunning(false);
  };

  const resumeTimer = () => {
    setIsRunning(true);
  };

  const restartTimer = () => {
    setTime(3599);
    setIsExpired(false);
    if (isRunning) {
      setIsRunning(true);
    } else {
      setIsRunning(false);
    }
  };

  return (
    <div className="timer-container">
      <button className="close-btn" onClick={onClose}>✕</button>
      
      <h2>Таймер</h2>
      
      <div className="timer-display">
        {formatTime(time)}
      </div>
      
      <div className="timer-controls">
        {!isExpired ? (
          <>
            {isRunning ? (
              <button onClick={stopTimer} className="stop-btn">Стоп</button>
            ) : (
              <button onClick={resumeTimer} className="resume-btn">Возобновить</button>
            )}
            <button onClick={restartTimer} className="restart-btn">Рестарт</button>
          </>
        ) : (
          <>
            <button disabled className="stop-btn disabled">Стоп</button>
            <button onClick={restartTimer} className="restart-btn active">Рестарт</button>
          </>
        )}
      </div>
    </div>
  );
}

export default LiveTimer;