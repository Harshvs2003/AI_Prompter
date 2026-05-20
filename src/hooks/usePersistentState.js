import { useEffect, useState } from 'react';
import { loadLocal, saveLocal } from '../utils/storage';

export function usePersistentState(key, initialValue) {
  const [value, setValue] = useState(() => loadLocal(key, initialValue));

  useEffect(() => {
    saveLocal(key, value);
  }, [key, value]);

  return [value, setValue];
}
