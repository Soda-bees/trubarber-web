import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import roleReducer from "./Role"


const rolePersistConfig = {
    key: "role",
    storage,
};

const rootReducer = combineReducers({
    role: persistReducer(rolePersistConfig, roleReducer),
});

export const store = configureStore({
    reducer: rootReducer,
});

export const persistor = persistStore(store);