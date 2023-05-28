import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth-slice";
import emailReducer from './email-slice'
const store = configureStore({
  reducer: { auth: authReducer, email:emailReducer },
});

export default store;
