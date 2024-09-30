import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface RoleState {
  role: string | null;
}

const initialState: RoleState = {
  role: 'user',
};

export const roleSlice = createSlice({
  name: "role",
  initialState,
  reducers: {
    setRole: (state, action: PayloadAction<string | null>) => {
      state.role = action.payload;
    }
  },
});

export const { setRole } = roleSlice.actions;

export const selectRole = (state: { role: RoleState }) => state.role.role;

export default roleSlice.reducer;
