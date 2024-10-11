import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import roleReducer from "./Role"
import authTokenReducer from "./AuthTokenSlice"
import userReducer from "./userDataSlice"

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

const rootReducer = combineReducers({
    role: persistReducer(rolePersistConfig, roleReducer),
    authToken: persistReducer(authTokenPersistConfig, authTokenReducer),
    user: persistReducer(userPersistConfig, userReducer),
});

export const store = configureStore({
    reducer: rootReducer,
});

export const persistor = persistStore(store);