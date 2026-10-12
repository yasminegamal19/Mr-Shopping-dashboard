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

export const updateAuthUser = (patch) => {
  const auth = getAuth();
  if (!auth) return;
  saveAuth({ ...auth, user: { ...auth.user, ...patch } });
};

export const logout = () => {
  localStorage.removeItem(AUTH_KEY);
};

export const isAuthenticated = () => !!getAuth()?.token;

// "product" | "service" | null
export const getProviderType = () =>
  getAuth()?.user?.provider?.provider_type ?? null;

// "approved" | "pending" | ... | null
export const getApprovalStatus = () =>
  getAuth()?.user?.provider?.approval_status ?? null;
