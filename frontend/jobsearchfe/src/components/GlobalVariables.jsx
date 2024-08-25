import { useState, useEffect  } from 'react';


export const useEmailGlobalVariable = (key, initialValue) => {
  // Retrieve the cached value from localStorage or use the provided initial value
  const getInitialValue = () => {
    const storedValue = localStorage.getItem(key);
    return storedValue !== null ? JSON.parse(storedValue) : initialValue;
  };

  const [emailGlobalVariable, setEmailGlobalVariable] = useState(getInitialValue);

  // Update the localStorage whenever the global variable changes
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(emailGlobalVariable));
  }, [key, emailGlobalVariable]);

  return [emailGlobalVariable, setEmailGlobalVariable];
};