import React, { useContext } from 'react';
import {
  BrowserRouter,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';

import { AppContext } from './AppContext';
import AppBar from './components/AppBar';

import Registration from './pages/Registration';
import Home from './pages/Home';
import HomeMember from './pages/HomeMember';
import HomeWatcher from './pages/HomeWatcher';
import Login from './pages/Login';

/* Router for all unauthenticated users */
const UnauthenticatedRouter = (
  <BrowserRouter>
    <AppBar />
    <Switch>
      <Route path="/">
        <Login />
      </Route>
    </Switch>
  </BrowserRouter>
);

/* Router for all authenticated users */
const AuthenticatedRouter = (role) => {
  return (
    <>
      <BrowserRouter>
        <AppBar />
        <Switch>
          <Route exact path="/">
            { role === 'member'
              ? <HomeMember />
              : role === 'watcher'
                ? <HomeWatcher />
                : <Home />
            }
          </Route>
          <Route path="/register">
            <Registration />
          </Route>
        </Switch>
        { role === null && (
          <Redirect to="/register" />
        )}
      </BrowserRouter>
    </>
  )
};

const Router = () => {
  const { authenticated, userRole } = useContext(AppContext);
  if (!authenticated) return UnauthenticatedRouter;
  return AuthenticatedRouter(userRole);
};
export default Router;