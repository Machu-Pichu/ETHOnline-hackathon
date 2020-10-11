import React, { useEffect, useState, useContext, useCallback } from 'react';

import {
  Button,
  Box,
} from '@material-ui/core';

import { AppContext } from '../AppContext';
import Paper from './Paper';

const RUPBalance = () => {
  const { tokenContract, userAddress } = useContext(AppContext);
  const [ balance, setBalance ] = useState(0);

  const loadValues = useCallback(() => {
    tokenContract.methods
      .balanceOf(userAddress)
      .call()
      .then(setBalance);
  }, [ tokenContract, userAddress ]);

  useEffect(() => {
    loadValues();
  }, [ loadValues ]);
  return (
    <Paper title="My RUP Balance">
      <Box mb={2}>
        { balance } RUP
      </Box>
      <Button color="primary" variant="contained" onClick={loadValues}>
        Refresh
      </Button>
    </Paper>
  );
};

export default RUPBalance;