export const removeLocalStorage = (key, refresh) => {
  localStorage.removeItem(key);
  if (refresh) window.location.reload();
};

export const getLocalStorage = (key) => {
  return localStorage.getItem(key);
};

export const setLocalStorage = (key, values) => {
  localStorage.setItem(key, values);
  return getLocalStorage(key);
};
