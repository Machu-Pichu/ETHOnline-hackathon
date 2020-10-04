import React, { useContext } from 'react';
import {
  BrowserRouter,
  Switch,
  Route,
} from 'react-router-dom';

import { AppContextProvider, AppContext } from './AppContext';
import Home from './pages/Home';
import Login from './pages/Login';

/* Router for all unauthenticated users */
const UnauthenticatedRouter = (
  <BrowserRouter>
    <Switch>
      <Route path="/">
        <Login />
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
          <Home />
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