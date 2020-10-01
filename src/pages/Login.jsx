import React, { useState, useEffect, useCallback, useContext } from 'react';
import Web3 from 'web3';

import {
  Alert,
} from '@material-ui/lab';

import {
  Button,
} from '@material-ui/core';

import { AppContext } from '../AppContext';
import Page from '../components/Page';
import Paper from '../components/Paper';

const Login = () => {
  const { onUserConnected } = useContext(AppContext);
  const [ web3Provider, setWeb3Provider ] = useState(null);
  
  // On page init, test if `window.ethereum` exists and init web3 provider
  useEffect(() => {
    if(window.ethereum) {
      setWeb3Provider(new Web3(window.ethereum));
    }
  }, []);

  const handleConnect = useCallback(() => {
    window.ethereum
      .enable()
      .then((accounts) => {
        if(accounts && accounts.length > 0) {
          // Select the first account
          onUserConnected(accounts[0], web3Provider);
        }
      })
      .catch((error) => {
        // User rejects the connection
        console.error(error);
      });
  });

  return (
    <Page>
      <Paper title="Please log in">
        { web3Provider === null && (
          <Alert severity="error" variant="filled">
            No Web3 provider detected. Please install MetaMask and reload this page.
          </Alert>
        )}
        { web3Provider !== null && (
          <Button
            variant="contained"
            color="primary"
            onClick={handleConnect}
          >
            Connect with MetaMask
          </Button>
        )}
      </Paper>
    </Page>
  );
};

export default Login;
