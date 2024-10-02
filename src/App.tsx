import React from 'react';
import logo from './logo.svg';
import './App.css';
import Header from './components/Header';
import Slider from './components/Slider';
import { Provider } from 'react-redux';
import { persistor, store } from './Store';
import { PersistGate } from 'redux-persist/integration/react';
import CreateUserProfile from './Screens/CreateUserProfile';
import LogoLine from './components/LogoLine';
import Welcome from './Screens/Welcome';
import Routing from './services/config/router';

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
      <Routing />
      </PersistGate>
    </Provider>
  );
}

export default App;
