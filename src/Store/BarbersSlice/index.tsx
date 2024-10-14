import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Barber {
    appoinment: any;
    businessProfile: null | string;
    businessVerification: null | string;
    chat: any;
    createdAt: string;
    description: string;
    email: string;
    gender: string;
    instagram: string;
    location: any;
    name: string;
    notification: any;
    offDays: any;
    phone: string | any;
    profile: null | string;
    reviews: any;
    role: string;
    services: any;
    tagSelection: any;
    time: string;
    updatedAt: string;
    __v: number;
    _id: string;
}

interface BarberState {
    barbers: Barber[]; 
}

const initialState: BarberState = {
    barbers: [],
};

const barberSlice = createSlice({
    name: "barber",
    initialState,
    reducers: {
        setBarbers(state, action: PayloadAction<Barber[]>) {
            state.barbers = action.payload; 
        },
        removeAllBarbers(state) {
            state.barbers = [];
        },
    },
});

export const { setBarbers , removeAllBarbers} = barberSlice.actions;

export const selectBarbers = (state: { barber: BarberState }) => state.barber.barbers; 

export default barberSlice.reducer; 

export {};


