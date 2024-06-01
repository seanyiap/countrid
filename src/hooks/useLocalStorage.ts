import { useState } from "react";

function getSavedValue(key) {
  const savedValue = JSON.parse(localStorage.getItem(key));
  if (savedValue) return savedValue;
}

function useLocalStorage(key, defaultValue) {
  const [value, setValue] = useState(
    JSON.parse(window.localStorage.getItem(key)) ?? defaultValue
  );

  const setStoredValue = (newValue) => {
    newValue = typeof newValue === "function" ? newValue(value) : newValue;
    window.localStorage.setItem(key, JSON.stringify(newValue));
    setValue(newValue);
  };

  return [value, setStoredValue];
}

export { getSavedValue, useLocalStorage };
