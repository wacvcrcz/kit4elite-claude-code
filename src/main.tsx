import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { NProgressProvider } from '@/providers/nprogress-provider';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <NProgressProvider>
        <App />
        <Toaster
          position="bottom-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#1a1a1a',
              color: '#fafafa',
              border: '1px solid #333',
              borderRadius: '0.5rem',
            },
            success: {
              iconTheme: {
                primary: '#10b981',
                secondary: '#fafafa',
              },
            },
            error: {
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fafafa',
              },
            },
          }}
        />
      </NProgressProvider>
    </BrowserRouter>
  </React.StrictMode>
);
