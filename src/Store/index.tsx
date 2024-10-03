import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import roleReducer from "./Role"
import authTokenReducer from "./AuthTokenSlice"


const rolePersistConfig = {
    key: "role",
    storage,
};
const authTokenPersistConfig = {
    key: "authToken",
    storage,
  };

const rootReducer = combineReducers({
    role: persistReducer(rolePersistConfig, roleReducer),
    authToken: persistReducer(authTokenPersistConfig, authTokenReducer),
});

export const store = configureStore({
    reducer: rootReducer,
});

export const persistor = persistStore(store);