import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Location {
  longitude: number;
  latitude: number;
}

interface LocationState {
  location: Location | null; // Define User or set as null initially
}

const initialState: LocationState = {
  location: null, // Initially null until a user is set
};

const LocationSlice = createSlice({
  name: "location",
  initialState,
  reducers: {
    setLocation(state, action: PayloadAction<Location | null>) {
      state.location = action.payload;
    },
    clearLocation(state) {
      state.location = null;
    },
  },
});

export const { setLocation, clearLocation } = LocationSlice.actions;

export const selectLocation = (state: { location: LocationState }) =>
  state.location.location;

export default LocationSlice.reducer;
