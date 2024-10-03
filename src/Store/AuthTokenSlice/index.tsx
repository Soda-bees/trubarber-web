import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  authToken: string | null;
}

const initialState: AuthState = {
  authToken: null,
};

export const authTokenSlice = createSlice({
  name: "authToken",
  initialState,
  reducers: {
    setAuthToken: (state, action: PayloadAction<string | null>) => {
      state.authToken = action.payload;
    },
    clearAuthToken: (state) => {
      state.authToken = null;
    },
  },
});

export const { setAuthToken, clearAuthToken } = authTokenSlice.actions;

export const selectAuthToken = (state: { authToken: AuthState }) => state.authToken.authToken;

export default authTokenSlice.reducer;