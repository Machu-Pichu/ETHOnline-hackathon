import React, { useContext, useEffect, useState, useCallback } from "react";

import {
  Typography,
  Button,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
  CircularProgress,
} from "@material-ui/core";

import { AppContext } from "../AppContext";

import Page from "../components/Page";
import Paper from "../components/Paper";

const ContributeDialog = ({ open, onClose, onContribute }) => {
  const [ amount, setAmount ] = useState(0);
  const [ loading, setLoading ] = useState(false);
  const confirm = () => {
    setLoading(true);
    return onContribute(amount);
  };
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Contribute</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Amount of RUP to contribute?
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
              Contribute
            </Button>
          </>
        )}
        { loading && <CircularProgress /> }
      </DialogActions>
    </Dialog>
  );
};

const HomeMember = () => {
  const {
    userAddress,
    mainContract,
  } = useContext(AppContext);

  const [ memberDetails, setMemberDetails ] = useState({
    name: '',
    village: '',
    lat: '',
    lng: '',
    mobileNo: '',
    groupId: '',
    merit: '',
    onboardingDate: null,
  });
  const [ contribution, setContribution ] = useState(0);
  const [ potAmount, setPotAmount ] = useState(0);
  const [ dialogOpen, setDialogOpen ] = useState(false);

  const loadValues = useCallback(() => {
    mainContract.methods
      .members(userAddress)
      .call()
      .then(({ name, village, onboardingDate, lat, lng, merit, contribution, groupId}) => {
        setMemberDetails({
          name, village, lat, lng, merit, groupId,
          onboardingDate: new Date(parseInt(onboardingDate) * 1000)
        });
        setContribution(parseInt(contribution));
      });
    mainContract.methods
      .pot()
      .call()
      .then(setPotAmount);
  }, [ mainContract, userAddress ]);

  const contribute = (amount) => {
    mainContract.methods
      .contribute(amount)
      .send({ from: userAddress })
      .then(({ transactionHash, status }) => {
        console.log(`Contribution status ${status} txHash ${transactionHash}`);
        loadValues();
        setDialogOpen(false);
      });
  };

  useEffect(() => {
    loadValues();
  }, [ loadValues ]);

  return (
    <Page>
      <Paper title="Member">
        <Typography variant="subtitle1">
          Connected member: { memberDetails.name } ({ memberDetails.village })
        </Typography>
        <Typography variant="subtitle1">
          Onboarding date: { (memberDetails.onboardingDate || '').toString() })
        </Typography>
        <Typography variant="subtitle1">
          Member contribution / total contribution: { contribution } / { potAmount } RUP
        </Typography>
        <Box mt={2}>
          <Button variant="contained" color="primary" onClick={() => setDialogOpen(true)}>
            Contribute
          </Button>
        </Box>
      </Paper>
      <ContributeDialog open={dialogOpen} onClose={() => setDialogOpen(false)} onContribute={contribute} />
    </Page>
  );
};

export default HomeMember;
