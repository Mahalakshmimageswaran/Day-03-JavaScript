import React, { useState, useRef, useEffect } from 'react';

export default function Timer({ autoStart = false }){
  const [running, setRunning] = useState(autoStart);
  const [seconds, setSeconds] = useState(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setSeconds(s => s + 1);
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [running]);

  const format = s => {
    const mm = String(Math.floor(s / 60)).padStart(2, '0');
    const ss = String(s % 60).padStart(2, '0');
    return `${mm}:${ss}`;
  };

  return (
    <div className="p-3 bg-white rounded shadow flex items-center gap-3">
      <div className="font-mono w-20">{format(seconds)}</div>
      <button
        onClick={() => setRunning(r => !r)}
        className={`px-3 py-1 rounded ${running ? 'bg-yellow-400' : 'bg-blue-600 text-white'}`}
      >
        {running ? 'Pause' : 'Start'}
      </button>
      <button
        onClick={() => { setSeconds(0); setRunning(false); }}
        className="px-2 py-1 rounded border ml-auto"
      >
        Reset
      </button>
    </div>
  );
}
