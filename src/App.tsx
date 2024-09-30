import React from 'react';
import logo from './logo.svg';
import './App.css';
import Header from './components/Header';
import Slider from './components/Slider';
import Signin from './screens/Signin';
import { Provider } from 'react-redux';
import { persistor, store } from './Store';
import { PersistGate } from 'redux-persist/integration/react';
import Signup from './screens/Signup';
import CreateUserProfile from './screens/CreateUserProfile';

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <CreateUserProfile />
      </PersistGate>
    </Provider>
  );
}

export default App;
