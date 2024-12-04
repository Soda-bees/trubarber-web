import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import roleReducer from "./Role"
import authTokenReducer from "./AuthTokenSlice"
import userReducer from "./userDataSlice"
import barberReducer from "./BarbersSlice"
import locationReducer from "./LocationSlice";
import pendingAppointemtReducer from "./PendingAppointment"

const rolePersistConfig = {
    key: "role",
    storage,
};
const authTokenPersistConfig = {
    key: "authToken",
    storage,
};

const userPersistConfig = {
    key: "user",
    storage,
};

const barbersPersistConfig = {
    key: "barber",
    storage,
};

const locationPersistConfig = {
    key: "location",
    storage,
};

const pendingAppointmentPersistConfig = {
    key:'pendingAppointment',
    storage
}

const rootReducer = combineReducers({
    role: persistReducer(rolePersistConfig, roleReducer),
    authToken: persistReducer(authTokenPersistConfig, authTokenReducer),
    user: persistReducer(userPersistConfig, userReducer),
    barber: persistReducer(barbersPersistConfig, barberReducer),
    location: persistReducer(locationPersistConfig, locationReducer),
    pendingAppointment: persistReducer(pendingAppointmentPersistConfig, pendingAppointemtReducer),
});

export const store = configureStore({
    reducer: rootReducer,
});

export const persistor = persistStore(store);