import React from 'react';
import { withStyles } from '@material-ui/core';

import Router from './Router';

const GlobalCss = withStyles({
  '@global': {
    html: {
      height: '100%',
    },
    body: {
      height: '100%',
    },
    '#main': {
      height: '100%',
    },
  },
})(() => null);


const App = () => {
  return (
    <>
      <GlobalCss />
      <Router />
    </>
  );
};

export default App;
