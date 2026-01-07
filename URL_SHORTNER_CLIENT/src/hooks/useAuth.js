import { useSelector, useDispatch } from "react-redux";
import { loginSuccess, logout as logoutAction } from "../app/authSlice.js";
import { login, signup } from "../services/auth.service.js";

export function useAuth() {
  const dispatch = useDispatch();
  const { accessToken, user, isAuthenticated } = useSelector(s => s.auth);

  const doLogin = async (payload) => {
    const data = await login(payload);
    dispatch(loginSuccess(data));
  };

  const doSignup = async (payload) => {
    const data = await signup(payload);
    dispatch(loginSuccess(data));
  };

  const logout = () => dispatch(logoutAction());

  return { accessToken, user, isAuthenticated, doLogin, doSignup, logout };
}
