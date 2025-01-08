import { createSlice, PayloadAction } from "@reduxjs/toolkit";

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
    _id: string;
    phone?: string
}

interface UserState {
    user: User | null;
}

const initialState: UserState = {
    user: null,
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
        },
        addAppoinment(state, action: PayloadAction<any>) {
            const appoinment = action.payload;
            if (state.user && appoinment?.user?._id === state.user?._id) {
                state.user.appoinment.push(appoinment)
            }
            if (state.user && appoinment?.barber?._id === state.user?._id) {
                state.user.appoinment.push(appoinment)
            }
        },
        updateAppointmendStatus(state, action: PayloadAction<any>) {
            const { _id, status } = action.payload
            if (state.user && state.user.appoinment) {
                state.user.appoinment = state.user.appoinment.map((appointment: any) =>
                    appointment._id === _id ? { ...appointment, status } : appointment
                )
            }
        },
        addMessageInChatRoom(state, action: PayloadAction<any>) {
            const { chatRoomId, newMessage } = action.payload
            if (state.user) {
                const chatIndex = state.user.chat.findIndex((chat: any) => chat._id === chatRoomId);
                if (chatIndex !== -1) {
                    state.user.chat[chatIndex].messages.push(newMessage)
                }
            }
        },
        addNewChatInRedux: (state, action: PayloadAction<any>) => {
            const newChat = action.payload;
            if (state.user) {
                if (newChat.user._id === state.user._id || newChat.barber._id === state.user._id) {
                    state.user.chat.push(newChat)
                }
            }
        },
        addAndUpdateNewChatInRedux: (state, action: PayloadAction<any>) => {
            const newChat = action.payload;
            if (state.user) {
                if (newChat.user._id === state.user._id || newChat.barber._id === state.user._id) {
                    const existingChatIndex = state.user.chat.findIndex((chat: any) => chat._id === newChat._id);
                    if (existingChatIndex !== -1) {
                        state.user.chat[existingChatIndex] = newChat;
                    } else {
                        state.user.chat.push(newChat);
                    }
                }
            }
        },
        setSeenTrueRedux: (state, action: PayloadAction<any>) => {
            const { chatRoomId, messageIds } = action.payload;
            if (state.user) {
                const updatedChats = state.user.chat.map((chat: any) => {
                    if (chat._id === chatRoomId) {
                        const updatedMessages = chat.messages.map((message: any) => {
                            if (messageIds.includes(message._id)) {
                                return {
                                    ...message,
                                    seen: true,
                                };
                            }
                            return message;
                        });

                        return {
                            ...chat,
                            messages: updatedMessages,
                        };
                    }
                    return chat;
                });

                return {
                    ...state,
                    user: {
                        ...state.user,
                        chat: updatedChats,
                    },
                };
            }
        },
        addReview: (state, action: PayloadAction<any>) => {
            const review = action.payload;
            if (state.user && review.userData._id === state.user._id) {
                return {
                    ...state,
                    user: {
                        ...state.user,
                        reviews: [...state.user.reviews, review],
                    },
                };
            }
            if (state.user && review.barberData === state.user._id) {
                return {
                    ...state,
                    user: {
                        ...state.user,
                        reviews: [...state.user.reviews, review],
                    },
                };
            }
        },
        updateReview: (state, action: PayloadAction<any>) => {
            const updatedReview = action.payload;
            if (state.user) {
                if (
                    updatedReview.userData._id === state.user._id ||
                    updatedReview.barberData === state.user._id
                ) {
                    const reviewIndex = state.user.reviews.findIndex(
                        (review: any) => review._id === updatedReview._id,
                    );
                    if (reviewIndex !== -1) {
                        state.user.reviews[reviewIndex] = updatedReview;
                    }
                }
            }
        },
        deleteReview: (state, action: PayloadAction<any>) => {
            const deletedReview = action.payload;
            if (state.user) {
                if (
                    deletedReview.userData._id === state.user._id ||
                    deletedReview.barberData === state.user._id
                ) {
                    const reviewIndex = state.user.reviews.findIndex(
                        (review: any) => review._id === deletedReview._id,
                    );
                    if (reviewIndex !== -1) {
                        state.user.reviews.splice(reviewIndex, 1);
                    }
                }
            }
            return state;
        },
        addNewNotificationRedux: (state, action: PayloadAction<any>) => {
            const newNotification = action.payload;
            if (state.user) {
                if (newNotification.user === state.user._id || newNotification.barber === state.user._id) {
                    state.user.notification.push(newNotification);
                }
            }
        },
        setNotificationSeenTrueRedux: (state) => {
            if (state.user) {
                if (state.user.role === 'user') {
                    const updatedNotifications = state.user.notification.map((notif: any) => ({
                        ...notif,
                        userSeen: true,
                    }));

                    const updatedUserData = {
                        ...state.user,
                        notification: updatedNotifications,
                    };
                    state.user = updatedUserData;
                } else {
                    const updatedNotifications = state.user.notification.map((notif: any) => ({
                        ...notif,
                        barberSeen: true,
                    }));

                    const updatedUserData = {
                        ...state.user,
                        notification: updatedNotifications,
                    };
                    state.user = updatedUserData;
                }
            }
        },
        addFavouritesRedux: (state, action: PayloadAction<any>) => {
            const barber = action.payload;
            const barberId = barber._id;
            if (state.user) {
                const index = state.user.favourites.findIndex((fav: any) => fav._id === barberId);
                if (index > -1) {
                    state.user.favourites.splice(index, 1);
                } else {
                    state.user.favourites.push(barber);
                }
            }
        },
        updateWalletRedux: (state, action: PayloadAction<any>) => {
            const balance = action.payload
            if (state.user) {
                state.user.wallet = balance;
            }

        },
        acceptAppointment: (state, action: PayloadAction<any>) => {
            const { status, acceptAppointment, rejectedAppointment, rejectedStatus } = action.payload;
            if (state.user) {
                state.user.appoinment = state.user.appoinment.map((appointment: any) => {
                    if (appointment._id === acceptAppointment) {
                        return {
                            ...appointment,
                            status: status
                        };
                    } else if (rejectedAppointment.includes(appointment._id)) {
                        return {
                            ...appointment,
                            status: rejectedStatus
                        };
                    }
                    return appointment;
                });
            }
        },
    },
});

export const {
    setUser,
    clearUser,
    addAppoinment,
    updateAppointmendStatus,
    addMessageInChatRoom,
    addNewChatInRedux,
    setSeenTrueRedux,
    addReview,
    updateReview,
    deleteReview,
    addNewNotificationRedux,
    setNotificationSeenTrueRedux,
    addFavouritesRedux,
    updateWalletRedux,
    addAndUpdateNewChatInRedux,
    acceptAppointment
} = userSlice.actions;

export const selectUser = (state: { user: UserState }) => state.user.user;

export default userSlice.reducer;
