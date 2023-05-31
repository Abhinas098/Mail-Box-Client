import { createSlice } from "@reduxjs/toolkit";

const emailSlice = createSlice({
  name: "email",
  initialState: {
    recieved: [],
    send: [],
    unread: 0,
    email:
      localStorage.getItem("email")?.replace(".", "")?.replace("@", "") || "",
  },

  reducers: {
    recievedMail(state, action) {
      state.recieved = action.payload;
    },
    sendMail(state, action) {
      state.send = action.payload;
    },
    unreadMessage(state, action) {
      state.unread = action.payload;
    },
  },
});

export const emailActions = emailSlice.actions;
export default emailSlice.reducer;
