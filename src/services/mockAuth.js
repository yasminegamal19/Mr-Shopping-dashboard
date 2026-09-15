const MOCK_USERS = [
  {
    id: 1,
    name: "Mr Shopping Admin",
    email: "admin@mrshopping.com",
    password: "123456",
    role: "admin",
  },
  {
    id: 2,
    name: "Demo Provider",
    email: "provider@mrshopping.com",
    password: "123456",
    role: "provider",
    providerType: "restaurant",
  },
];

export const loginMockUser = (email, password) => {
  const user = MOCK_USERS.find(
    (item) => item.email === email && item.password === password,
  );

  if (!user) {
    return {
      success: false,
      message: "Invalid email or password",
    };
  }

  const { password: _, ...safeUser } = user;

  return {
    success: true,
    user: safeUser,
    token: "mock-token-123456",
  };
};

export const saveAuth = (authData) => {
  localStorage.setItem("mr-shopping-auth", JSON.stringify(authData));
};

export const getAuth = () => {
  const auth = localStorage.getItem("mr-shopping-auth");

  if (!auth) {
    return null;
  }

  try {
    return JSON.parse(auth);
  } catch {
    localStorage.removeItem("mr-shopping-auth");
    return null;
  }
};

export const logout = () => {
  localStorage.removeItem("mr-shopping-auth");
};

export const isAuthenticated = () => {
  return !!getAuth();
};
