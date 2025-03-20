import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { NotificationProvider } from './ForSellerBidNotificationContext/NotificationContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <NotificationProvider>
  <React.StrictMode>
    <App />
  </React.StrictMode>
  </NotificationProvider>
);

reportWebVitals();
