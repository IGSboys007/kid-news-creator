
import React from 'react';
import ReactDOM from 'react-dom/client';
import Dashboard from './Dashboard';

import './index.css'; // Optional if you have global styles

const rootElement = document.getElementById('root');

if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <Dashboard />
    </React.StrictMode>
  );
} else {
  console.error('Root element not found');
}
