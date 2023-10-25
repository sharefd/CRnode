import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './assets/main.css';
import './assets/button.css';

import { Provider } from 'mobx-react';
import userStore from './stores/userStore.js';
import { QueryClient, QueryClientProvider } from 'react-query';

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider userStore={userStore}>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </Provider>
);
