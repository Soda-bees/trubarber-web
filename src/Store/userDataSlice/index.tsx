import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define the structure of the user or use Partial for flexibility
interface User {
    name: string;
    email: string;
    appoinment: any;
    card: any;
    chat: any;
    createdAt: string;
    favourites: any;
    gender: string;
    location: any;
    notification: any;
    password: string;
    profile: null | string;
    reviews: any;
    role: string;
    survey: any;
    tagSelection: any;
    updatedAt: string;
    wallet: number;
    __v: number;
    _id: string
}

interface UserState {
    user: User | null;  // Define User or set as null initially
}

const initialState: UserState = {
    user: null, // Initially null until a user is set
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser(state, action: PayloadAction<User | null>) {
            state.user = action.payload; 
        },
        clearUser(state) {
            state.user = null;
        }
    },
});

export const { setUser, clearUser } = userSlice.actions;

export const selectUser = (state: { user: UserState }) => state.user.user;

export default userSlice.reducer;
