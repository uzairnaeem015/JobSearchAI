import { useState, useEffect } from 'react';

export const useEmailGlobalVariable = (key = 'email', initialValue = '') => {
  const getInitialValue = () => {
    const storedValue = localStorage.getItem(key);
    return storedValue !== null ? JSON.parse(storedValue) : initialValue;
  };

  const [emailGlobalVariable, setEmailGlobalVariable] = useState(getInitialValue);

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(emailGlobalVariable));
  }, [key, emailGlobalVariable]);

  return [emailGlobalVariable, setEmailGlobalVariable];
};

export const useNameGlobalVariable = (key = 'name', initialValue = '') => {
  const getInitialValue = () => {
    const storedValue = localStorage.getItem(key);
    return storedValue !== null ? JSON.parse(storedValue) : initialValue;
  };

  const [nameGlobalVariable, setNameGlobalVariable] = useState(getInitialValue);

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(nameGlobalVariable));
  }, [key, nameGlobalVariable]);

  return [nameGlobalVariable, setNameGlobalVariable];
};

export const useHashPasswordGlobalVariable = (key = 'password', initialValue = '') => {
  const getInitialValue = () => {
    const storedValue = localStorage.getItem(key);
    return storedValue !== null ? JSON.parse(storedValue) : initialValue;
  };

  const [passwordGlobalVariable, setHashPasswordGlobalVariable] = useState(getInitialValue);

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(passwordGlobalVariable));
  }, [key, passwordGlobalVariable]);

  return [passwordGlobalVariable, setHashPasswordGlobalVariable];
};

export const useClearGlobalVariables = () => {
  const [emailGlobalVariable, setEmailGlobalVariable] = useEmailGlobalVariable();
  const [nameGlobalVariable, setNameGlobalVariable] = useNameGlobalVariable();
  const [passwordGlobalVariable, setHashPasswordGlobalVariable] = useHashPasswordGlobalVariable();

  return () => {
    setEmailGlobalVariable('');
    setNameGlobalVariable('');
    setHashPasswordGlobalVariable('');
    localStorage.removeItem('email');
    localStorage.removeItem('name');
    localStorage.removeItem('password');
  };
};