import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { HelmetProvider } from 'react-helmet-async';
import CssBaseline from '@mui/material/CssBaseline';
import App from './App';
import ErrorBoundary from './components/ErrorBoundary';
import store from './store/store';
import theme from './theme';
import './index.css';

console.log('Application is starting...');

const rootElement = document.getElementById('root');

if (!rootElement) {
  console.error('Failed to find the root element');
} else {
  console.log('Root element found, rendering application...');
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <ErrorBoundary>
        <Provider store={store}>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <BrowserRouter>
              <HelmetProvider>
                <App />
              </HelmetProvider>
            </BrowserRouter>
          </ThemeProvider>
        </Provider>
      </ErrorBoundary>
    </React.StrictMode>
  );
}
