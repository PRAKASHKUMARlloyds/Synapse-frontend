import { BrowserRouter } from 'react-router-dom';
import { RoutesList } from '../src/components/app/RouteList'; // adjust path as needed
import './App.css';
import { Provider } from 'react-redux';
import store from './store';
import { ToastContainer } from 'react-toastify';

function App() {
  return (
     <Provider store={store}>
      <BrowserRouter>
        <RoutesList />
      </BrowserRouter>
      <ToastContainer />
    </Provider>
  );
}

export default App;