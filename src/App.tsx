import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { RoutesList } from '../src/components/app/RouteList'; // adjust path as needed
import './App.css';
import { Provider } from 'react-redux';
import store from './store';


function App() {
  return (
     <Provider store={store}>
      <BrowserRouter>
        <RoutesList />
      </BrowserRouter>
    </Provider>

  );
}

export default App;