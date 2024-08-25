import { useState, useEffect } from 'react';

// Hook for managing email in localStorage
export const useEmailGlobalVariable = (key = 'email', initialValue = '') => {
  const getInitialValue = () => {
    const storedValue = localStorage.getItem(key);
    if (storedValue === null || storedValue === 'undefined') {
      return initialValue;
    }
    try {
      return JSON.parse(storedValue);
    } catch {
      return initialValue; // Return initial value if parsing fails
    }
  };

  const [emailGlobalVariable, setEmailGlobalVariable] = useState(getInitialValue);

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(emailGlobalVariable));
  }, [key, emailGlobalVariable]);

  return [emailGlobalVariable, setEmailGlobalVariable];
};

// Hook for managing name in localStorage
export const useNameGlobalVariable = (key = 'name', initialValue = '') => {
  const getInitialValue = () => {
    const storedValue = localStorage.getItem(key);
    if (storedValue === null || storedValue === 'undefined') {
      return initialValue;
    }
    try {
      return JSON.parse(storedValue);
    } catch {
      return initialValue; // Return initial value if parsing fails
    }
  };

  const [nameGlobalVariable, setNameGlobalVariable] = useState(getInitialValue);

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(nameGlobalVariable));
  }, [key, nameGlobalVariable]);

  return [nameGlobalVariable, setNameGlobalVariable];
};

export const useClearGlobalVariables = () => {
  const [emailGlobalVariable, setEmailGlobalVariable] = useEmailGlobalVariable();
  const [nameGlobalVariable, setNameGlobalVariable] = useNameGlobalVariable();

  return () => {
    setEmailGlobalVariable('');
    setNameGlobalVariable('');
    localStorage.removeItem('email');
    localStorage.removeItem('name');
  };
};