import React, { useContext, useEffect, useState, useCallback } from "react";

import {
  Typography,
  Dialog,
  DialogTitle,
  DialogContentText,
  DialogContent,
  TextField,
  DialogActions,
  Button,
  Box,
  CircularProgress
} from "@material-ui/core";

import { AppContext } from "../AppContext";

import Page from "../components/Page";
import Paper from "../components/Paper";
import RUPBalance from '../components/RUPBalance';

const StakeDialog = ({ open, onClose, onStake }) => {
  const [ amount, setAmount ] = useState(0);
  const [ loading, setLoading ] = useState(false);
  const confirm = () => {
    setLoading(true);
    return onStake(amount);
  };
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Stake</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Amount of RUP to stake?
        </DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          type="number"
          fullWidth
          value={amount}
          onChange={(evt) => setAmount(evt.target.value)}
        />
      </DialogContent>
      <DialogActions>
        { !loading && (
          <>
            <Button onClick={onClose} color="primary">
              Cancel
            </Button>
            <Button onClick={confirm} color="primary">
              Stake
            </Button>
          </>
        )}
        { loading && <CircularProgress /> }
      </DialogActions>
    </Dialog>
  );
};

const AssessDialog = ({ open, onClose, onAssess }) => {
  const [ valueGroup1, setValueGroup1 ] = useState('0');
  const [ valueGroup2, setValueGroup2 ] = useState('0');
  const [ valueGroup3, setValueGroup3 ] = useState('0');
  const [ loading, setLoading ] = useState(false);
  const confirm = () => {
    setLoading(true);
    return onAssess(valueGroup1, valueGroup2, valueGroup3);
  };
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Assessment</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Please enter the value for your assessments
        </DialogContentText>
        <TextField
          autoFocus
          label="Group 1"
          margin="dense"
          type="number"
          fullWidth
          value={valueGroup1}
          onChange={(evt) => setValueGroup1(evt.target.value)}
        />
        <TextField
          label="Group 2"
          margin="dense"
          type="number"
          fullWidth
          value={valueGroup2}
          onChange={(evt) => setValueGroup2(evt.target.value)}
        />
        <TextField
          label="Group 3"
          margin="dense"
          type="number"
          fullWidth
          value={valueGroup3}
          onChange={(evt) => setValueGroup3(evt.target.value)}
        />
      </DialogContent>
      <DialogActions>
        { !loading && (
          <>
            <Button onClick={onClose} color="primary">
              Cancel
            </Button>
            <Button onClick={confirm} color="primary">
              Confirm
            </Button>
          </>
        )}
        { loading && <CircularProgress /> }
      </DialogActions>
    </Dialog>
  );
};

const HomeWatcher = () => {
  const {
    userAddress,
    mainContract,
    tokenContract,
  } = useContext(AppContext);

  const [ currentStake, setCurrentStake ] = useState(0);
  const [ stakeDialogOpen, setStakeDialogOpen ] = useState(false);
  const [ assessDialogOpen, setAssessDialogOpen ] = useState(false);

  const loadValues = useCallback(() => {
    mainContract.methods
      .currentMonth()
      .call()
      .then(
        (currentMonth) => {
          mainContract.methods.getStakedAmountInAMonth(currentMonth).call({ from: userAddress }).then(setCurrentStake);
          // TODO `watcherAssessments` is not public: cannot retrieve the current assessments for this watcher
          // mainContract.methods.watcherAssessments(currentMonth, userAddress).call({ from: userAddress }).then(console.log);
        }
      );
  }, [ mainContract, userAddress ]);

  const stake = (amount) => {
    // TODO: use Token decimals!
    tokenContract.methods
      .approve(mainContract.options.address, amount)
      .send(({ from: userAddress }))
      .then(({ transactionHash, status }) => {
        console.log(`Approve spender transaction status: ${status} hash: ${transactionHash}`);
        mainContract.methods
          .stake(amount)
          .send({ from: userAddress })
          .then(({ transactionHash, status }) => {
            console.log(`Stake transaction status: ${status} hash: ${transactionHash}`);
            loadValues();
            setStakeDialogOpen(false);
          });
      });
  };

  const assess = async (group1, group2, group3) => {
    const resGroup1 = await mainContract.methods.doAssessmentForAGroup(1, group1).send({ from: userAddress });
    console.log(`Assessment transaction for group1 status: ${resGroup1.status} txhash: ${resGroup1.transactionHash}`);
    const resGroup2 = await mainContract.methods.doAssessmentForAGroup(2, group2).send({ from: userAddress });
    console.log(`Assessment transaction for group3 status: ${resGroup2.status} txhash: ${resGroup2.transactionHash}`);
    const resGroup3 = await mainContract.methods.doAssessmentForAGroup(3, group3).send({ from: userAddress });
    console.log(`Assessment transaction for group3 status: ${resGroup3.status} txhash: ${resGroup3.transactionHash}`);
    loadValues();
    setAssessDialogOpen(false);
  };

  useEffect(() => {
    loadValues();
  }, [ loadValues ]);
  
  return (
    <Page>
      <RUPBalance />
      <Paper title="Watcher">
        <Typography variant="subtitle1">
          Connected user: {userAddress}
        </Typography>
        <Typography variant="subtitle1">
          Stake for current month: { currentStake } RUP
        </Typography>
        <Box mt={2}>
          <Button variant="contained" color="primary" onClick={() => setStakeDialogOpen(true)}>
            Stake
          </Button>
          <Button style={{ marginLeft: 10 }} variant="contained" color="primary" onClick={() => setAssessDialogOpen(true)} disabled={currentStake === 0}>
            Assess
          </Button>
        </Box>
      </Paper>
      <StakeDialog open={stakeDialogOpen} onClose={() => setStakeDialogOpen(false)} onStake={stake} />
      <AssessDialog open={assessDialogOpen} onClose={() => setAssessDialogOpen(false)} onAssess={assess} />
    </Page>
  );
};

export default HomeWatcher;
