import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { Provider } from 'mobx-react';
import userStore from './stores/userStore.js';
import { QueryClient, QueryClientProvider } from 'react-query';
import './main.css';
import 'tw-elements-react/dist/css/tw-elements-react.min.css';
import 'tw-elements/dist/css/tw-elements.min.css';

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider userStore={userStore}>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </Provider>
);
