import React, { useState, useEffect } from 'react';

export default function Counter({ initial = 0, onChange } ){
  const [count, setCount] = useState(initial);

  useEffect(() => {
    onChange?.(count);
  }, [count, onChange]);

  return (
    <div className="p-3 bg-white rounded shadow flex items-center gap-3">
      <button
        onClick={() => setCount(c => c - 1)}
        className="px-3 py-1 bg-gray-100 rounded"
        aria-label="decrement"
      >
        -
      </button>

      <div className="font-medium">{count}</div>

      <button
        onClick={() => setCount(c => c + 1)}
        className="px-3 py-1 bg-gray-100 rounded"
        aria-label="increment"
      >
        +
      </button>

      <button
        onClick={() => setCount(initial)}
        className="ml-auto text-sm text-gray-500"
      >
        Reset
      </button>
    </div>
  );
}
