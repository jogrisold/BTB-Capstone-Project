import React from 'react';
//import ReactDOM from 'react-dom/client';
import App from './components/App';
import 'mapbox-gl/dist/mapbox-gl.css';
import './index.css';
import { UserProvider } from './components/UserContext';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <UserProvider>
      <App />
    </UserProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals