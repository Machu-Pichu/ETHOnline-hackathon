import React, { useContext } from 'react';
import {
  BrowserRouter,
  Switch,
  Route,
} from 'react-router-dom';

import { AppContext } from './AppContext';
import HomePage from './pages/Home';
import LoginPage from './pages/Login';

/* Router for all unauthenticated users */
const UnauthenticatedRouter = (
  <BrowserRouter>
    <Switch>
      <Route path="/">
        <LoginPage />
      </Route>
    </Switch>
  </BrowserRouter>
);

/* Router for all authenticated users */
const AuthenticatedRouter = (
  <>
    <BrowserRouter>
      <Switch>
        <Route path="/">
          <HomePage />
        </Route>
      </Switch>
    </BrowserRouter>
  </>
);

const Router = () => {
  const { authenticated } = useContext(AppContext);
  if (!authenticated) return UnauthenticatedRouter;
  return AuthenticatedRouter;
};

export default Router;
