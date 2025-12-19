export const getUsers = () =>
  JSON.parse(localStorage.getItem("users")) || [];

export const saveUsers = (users) =>
  localStorage.setItem("users", JSON.stringify(users));

export const setCurrentUser = (user) =>
  localStorage.setItem("currentUser", JSON.stringify(user));

export const getCurrentUser = () =>
  JSON.parse(localStorage.getItem("currentUser"));

export const logout = () =>
  localStorage.removeItem("currentUser");
