import React, { useContext, useEffect, useState } from 'react';

import {
  Typography,
} from '@material-ui/core';

import { AppContext } from '../AppContext';

import Page from '../components/Page';
import Paper from '../components/Paper';

const Home = () => {
  const { userAddress, web3provider } = useContext(AppContext);
  const [ network, setNetwork ] = useState(null);

  // On page loading, retrieve network infos
  useEffect(() => {
    web3provider.eth.net
      .getNetworkType()
      .then(setNetwork)
  }, []);

  return (
    <Page>
      <Paper title="Welcome">
        <Typography variant="subtitle1">
          Connected user: { userAddress}
        </Typography>
        { network && (
          <Typography variant="subtitle1">
            Connected network: { network }
          </Typography>
        )}
      </Paper>
    </Page>
  );
};

export default Home;
