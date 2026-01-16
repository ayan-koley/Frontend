import api from "./api.js";

export async function signup({ username, fullName, email, password }) {
  
  const { data } = await api.post("/user/register", { username, fullName, email, password });
  return data;
}

export async function login({ username, email, password }) {
  const { data } = await api.post("/user/login", { username, email, password }, { withCredentials: true});
  return data.data;
}

export async function currentUser() {
  const { data } = await api.get("/user/current-user", {
    withCredentials: true
  })

  return data.data;
}