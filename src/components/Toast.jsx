import React, { useEffect } from 'react';

function Toast({ message, show, onDone }) {
  useEffect(() => {
    if (!show) return;
    const timer = setTimeout(onDone, 1800);
    return () => clearTimeout(timer);
  }, [show, onDone]);

  if (!show) return null;

  return (
    <div className="fixed bottom-4 right-4 rounded-md border border-emerald-600 bg-emerald-900/90 px-3 py-2 text-xs text-emerald-100 shadow-lg">
      {message}
    </div>
  );
}

export default Toast;
