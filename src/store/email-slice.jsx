import { createSlice } from "@reduxjs/toolkit";

const emailSlice = createSlice({
  name: "email",
  initialState: {
    recieved: [],
    unread: 0,
    email:
      localStorage.getItem("email")?.replace(".", "")?.replace("@", "") || "",
  },
  reducers: {
    recievedMail(state, action) {
      state.recieved = action.payload;
    },
    unreadMessage(state, action) {
      state.unread = action.payload;
    },
  },
});
export const emailActions = emailSlice.actions;
export default emailSlice.reducer;
