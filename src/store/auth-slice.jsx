import { createSlice } from "@reduxjs/toolkit";

const initialToken = localStorage.getItem("token");
const authSlice = createSlice({
  name: "auth",
  initialState: {
    token: initialToken,
    isLoggedIn: !!initialToken,
  },
  reducers: {
    isLogin(state, action) {
      state.isLoggedIn = true;
      state.token = action.payload;
    },
    isLogout(state, action) {
      state.isLoggedIn = false;
      state.token = action.payload;
    },
  },
});

export const authActions = authSlice.actions;
export default authSlice.reducer;
