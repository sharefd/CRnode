import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './assets/main.css';
import { Provider } from 'mobx-react';
import userStore from './stores/userStore.js';

ReactDOM.createRoot(document.getElementById('root')).render(
  // <React.StrictMode>
  <Provider userStore={userStore}>
    <App />
  </Provider>
  // </React.StrictMode>
);
