import api from "./api.js";

export async function signup({ username, fullName, email, password }) {
  
  const { data } = await api.post("/api/v1/user/register", { username, fullName, email, password });
  return data;
}

export async function login({ username, email, password }) {
  const { data } = await api.post("/api/v1/user/login", { username, email, password }, { withCredentials: true});
  return data.data;
}
