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
        updateReviewBarberSlice: (state, action: PayloadAction<any>) => {
            const updatedReview = action.payload;
            const barberId = updatedReview.barberData;
            const barberIndex = state.barbers.findIndex((barber) => barber._id === barberId);
            if (barberIndex !== -1) {
                state.barbers[barberIndex].reviews = state.barbers[barberIndex].reviews.map((review: any) =>
                    review._id === updatedReview._id ? updatedReview : review
                );
            }
        },
        deleteReviewBarberSlice: (state, action: PayloadAction<any>) => {
            const reviewToDelete = action.payload;
            const barberId = reviewToDelete.barberData;
            const barberIndex = state.barbers.findIndex((barber) => barber._id === barberId);

            if (barberIndex !== -1) {
                state.barbers[barberIndex].reviews = state.barbers[barberIndex].reviews.filter(
                    (review: any) => review._id !== reviewToDelete._id
                );
            }
        },
        addReviewBarberSlice: (state, action: PayloadAction<any>) => {
            const newReview = action.payload; 
            const barberId = newReview.barberData; 
            const barberIndex = state.barbers.findIndex((barber) => barber._id === barberId);
        
            if (barberIndex !== -1) {
                state.barbers[barberIndex].reviews.push(newReview);
            }
        }   
    },
});

export const { setBarbers, removeAllBarbers, updateReviewBarberSlice , deleteReviewBarberSlice , addReviewBarberSlice} = barberSlice.actions;

export const selectBarbers = (state: { barber: BarberState }) => state.barber.barbers;

export default barberSlice.reducer;

export { };


