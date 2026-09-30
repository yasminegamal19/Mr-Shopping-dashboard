const AUTH_KEY = "mr-shopping-auth";

export const saveAuth = (authData) => {
  localStorage.setItem(AUTH_KEY, JSON.stringify(authData));
};

export const getAuth = () => {
  const auth = localStorage.getItem(AUTH_KEY);
  if (!auth) return null;

  try {
    return JSON.parse(auth);
  } catch {
    localStorage.removeItem(AUTH_KEY);
    return null;
  }
};

export const logout = () => {
  localStorage.removeItem(AUTH_KEY);
};

export const isAuthenticated = () => !!getAuth()?.token;
