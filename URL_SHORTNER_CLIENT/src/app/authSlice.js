import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  accessToken: "",
  user: null,
  isAuthenticated: false
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess(state, action) {
      const { accessToken, user } = action.payload;
      state.accessToken = accessToken;
      state.user = user;
      state.isAuthenticated = true;
    },
    logout(state) {
      state.accessToken = null;
      state.user = null;
      state.isAuthenticated = false;
    },
  },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;
