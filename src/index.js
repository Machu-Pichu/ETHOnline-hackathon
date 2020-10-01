/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import { render } from 'react-dom';
import CssBaseline from '@material-ui/core/CssBaseline';
import { ThemeProvider } from '@material-ui/core/styles';

import theme from './theme';
import App from './App';
import { AppContextProvider } from './AppContext';


render(
  <AppContextProvider>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </AppContextProvider>
  ,
  document.querySelector('#main'),
);