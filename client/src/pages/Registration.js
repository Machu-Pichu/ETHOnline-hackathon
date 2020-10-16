import React, { useContext, useState } from "react";

import { Link, useHistory } from "react-router-dom";

import {
  Typography,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  CircularProgress,
  Button,
  makeStyles,
} from "@material-ui/core";

import { AppContext } from "../AppContext";

import Page from "../components/Page";
import Paper from "../components/Paper";

const useStyles = makeStyles((theme) => ({
  formControl: {
    minWidth: 200,
  },
  formField: {
    marginTop: theme.spacing(1),
  },
}));

const Registration = () => {
  const classes = useStyles();
  const {
    userAddress,
    userContract,
    mainContract,
    userRole,
    onUserRegistered,
  } = useContext(AppContext);

  const history = useHistory();

  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState("");
  const [memberName, setMemberName] = useState("");
  const [memberVillage, setMemberVillage] = useState("");
  const [memberLat, setMemberLat] = useState("");
  const [memberLng, setMemberLng] = useState("");
  const [memberMobile, setMemberMobile] = useState("");

  const formValid =
    role !== "" &&
    ((role === "member" &&
      memberName !== "" &&
      memberVillage !== "" &&
      memberLat !== "" &&
      memberLng !== "" &&
      memberMobile !== "") ||
      role === "watcher" ||
      role === "enabler");

  const register = () => {
    const userType = role === "member" ? 0 : role === "watcher" ? 1 : 2;
    setLoading(true);
    userContract.methods
      .register(userType)
      .send({ from: userAddress })
      .then(({ transactionHash, status }) => {
        console.log(
          `User registration status: ${status}, txHash: ${transactionHash}`
        );
        if (role === "watcher" || role === "enabler") {
          // Registration is done
          return;
        }
        if (role === "member") {
          // Onboard member
          // TODO: form validation on integers
          return mainContract.methods
            .onboardMember(
              memberName,
              memberVillage,
              parseInt(memberLat),
              parseInt(memberLng),
              memberMobile
            )
            .send({ from: userAddress })
            .then(({ transactionHash, status }) => {
              console.log(
                `Member onboarding status: ${status}, txHash: ${transactionHash}`
              );
            });
        }
      })
      .then(async () => {
        // Go to home
        await onUserRegistered();
        history.push("/");
      });
  };

  return (
    <Page>
      <Paper title="Registration">
        {userRole !== null && (
          <Typography variant="subtitle1">
            You are already registered.
            <Link to="/">Go to home page</Link>
          </Typography>
        )}
        {userRole === null && (
          <>
            <Typography variant="subtitle1">
              You must register to access the services
            </Typography>
            <Box mt={2}>
              <FormControl className={classes.formControl}>
                <InputLabel>Role</InputLabel>
                <Select
                  value={role}
                  onChange={(evt) => setRole(evt.target.value)}
                >
                  <MenuItem value="member">Member</MenuItem>
                  <MenuItem value="enabler">Enabler</MenuItem>
                  <MenuItem value="watcher">Watcher</MenuItem>
                </Select>
              </FormControl>
              {role === "member" && (
                <Box>
                  <TextField
                    className={classes.formField}
                    fullWidth
                    label="Name"
                    variant="outlined"
                    value={memberName}
                    onChange={(evt) => setMemberName(evt.target.value)}
                  />
                  <TextField
                    className={classes.formField}
                    fullWidth
                    label="Village"
                    variant="outlined"
                    value={memberVillage}
                    onChange={(evt) => setMemberVillage(evt.target.value)}
                  />
                  <TextField
                    className={classes.formField}
                    fullWidth
                    label="Latitude"
                    variant="outlined"
                    type="number"
                    value={memberLat}
                    onChange={(evt) => setMemberLat(evt.target.value)}
                  />
                  <TextField
                    className={classes.formField}
                    fullWidth
                    label="Longitude"
                    variant="outlined"
                    type="number"
                    value={memberLng}
                    onChange={(evt) => setMemberLng(evt.target.value)}
                  />
                  <TextField
                    className={classes.formField}
                    fullWidth
                    label="Mobile"
                    variant="outlined"
                    value={memberMobile}
                    onChange={(evt) => setMemberMobile(evt.target.value)}
                  />
                </Box>
              )}
            </Box>
            <Box mt={2}>
              {!loading && (
                <Button
                  variant="contained"
                  color="primary"
                  disabled={!formValid}
                  onClick={register}
                >
                  Register
                </Button>
              )}
              {loading && <CircularProgress />}
            </Box>
          </>
        )}
      </Paper>
    </Page>
  );
};

export default Registration;
