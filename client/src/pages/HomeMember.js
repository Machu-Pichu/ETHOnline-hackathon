import React, { useContext, useEffect, useState, useCallback } from "react";
import Countdown from "react-countdown";
import farmer from "../assets/images/farmer.png";

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
import RUPBalance from "../components/RUPBalance";
import rupeetoken from "../assets/images/rupeetoken.jpg";

const formatDate = (date) => {
  if (date === null) return "";
  return `${date.getUTCDate()}/${
    date.getUTCMonth() + 1
  }/${date.getUTCFullYear()} ${date.getUTCHours()}:${date.getUTCMinutes()} UTC`;
};

const ContributeDialog = ({ open, onClose, onContribute }) => {
  const [amount, setAmount] = useState(0);
  const [loading, setLoading] = useState(false);
  const confirm = () => {
    setLoading(true);
    return onContribute(amount);
  };
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Contribute</DialogTitle>
      <DialogContent>
        <DialogContentText>Amount of RUP to contribute?</DialogContentText>
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
        {!loading && (
          <>
            <Button
              onClick={onClose}
              color="primary"
              style={{ backgroundColor: "red", color: "white" }}
            >
              Cancel
            </Button>
            <Button
              onClick={confirm}
              color="primary"
              style={{ backgroundColor: "green", color: "white" }}
            >
              Proceed & Send OTP
            </Button>
          </>
        )}
        {loading && <CircularProgress />}
      </DialogActions>
    </Dialog>
  );
};

const VerifyOTPDialog = ({ open, onClose, verifyOTP, amount, mobileNo }) => {
  const [otp, setOtp] = useState(0);
  const [loading, setLoading] = useState(false);
  const [otpStartTime, setOtpStartTime] = useState(Date.now());
  const confirm = () => {
    setLoading(true);
    return verifyOTP(otp, amount);
  };
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle style={{ border: "1px dashed", margin: "5px" }}>
        Verify OTP: <Countdown date={otpStartTime + 10000 * 18} />{" "}
      </DialogTitle>

      <DialogTitle>Message sent to: {mobileNo}</DialogTitle>

      <DialogContent>
        <DialogContentText>Enter the OTP to verify & proceed</DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          type="number"
          fullWidth
          value={otp}
          onChange={(evt) => setOtp(evt.target.value)}
        />
      </DialogContent>
      <DialogActions>
        {!loading && (
          <>
            <Button
              onClick={onClose}
              color="primary"
              style={{ backgroundColor: "red", color: "white" }}
            >
              Cancel
            </Button>
            <Button
              onClick={confirm}
              color="primary"
              style={{ backgroundColor: "green", color: "white" }}
            >
              Verify & Contribute
            </Button>
          </>
        )}
        {loading && <CircularProgress />}
      </DialogActions>
    </Dialog>
  );
};

const PayoutOTPDialog = ({ open, onClose, verifyOTP, mobileNo }) => {
  const [otp, setOtp] = useState(0);
  const [loading, setLoading] = useState(false);
  const [otpStartTime, setOtpStartTime] = useState(Date.now());
  const confirm = () => {
    setLoading(true);
    return verifyOTP(otp);
  };
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle style={{ border: "1px dashed", margin: "5px" }}>
        Verify OTP: <Countdown date={otpStartTime + 10000 * 18} />{" "}
      </DialogTitle>

      <DialogTitle>Message sent to: {mobileNo}</DialogTitle>
      <DialogContent>
        <DialogContentText>Enter the OTP to verify & proceed</DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          type="number"
          fullWidth
          value={otp}
          onChange={(evt) => setOtp(evt.target.value)}
        />
      </DialogContent>
      <DialogActions>
        {!loading && (
          <>
            <Button
              onClick={onClose}
              color="primary"
              style={{ backgroundColor: "red", color: "white" }}
            >
              Cancel
            </Button>
            <Button
              onClick={confirm}
              color="primary"
              style={{ backgroundColor: "green", color: "white" }}
            >
              Verify & Get Payout
            </Button>
          </>
        )}
        {loading && <CircularProgress />}
      </DialogActions>
    </Dialog>
  );
};

const HomeMember = () => {
  const { userAddress, mainContract, isPortis } = useContext(AppContext);

  const [memberDetails, setMemberDetails] = useState({
    name: "",
    village: "",
    lat: "",
    lng: "",
    mobileNo: "",
    groupId: "",
    merit: "",
    onboardingDate: null,
    contribution: 0,
  });
  const [potAmount, setPotAmount] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [otpOpen, setOtpOpen] = useState(false);
  const [payoutOpen, setPayoutOpen] = useState(false);
  const [pendingCompensations, setPendingCompensations] = useState(0);
  const [amount, setAmount] = useState(0);

  const loadValues = useCallback(() => {
    mainContract.methods
      .members(userAddress)
      .call()
      .then(
        ({
          name,
          village,
          onboardingDate,
          lat,
          lng,
          merit,
          contribution,
          mobileNo,
          groupId,
        }) => {
          setMemberDetails({
            name,
            village,
            lat,
            lng,
            merit,
            groupId,
            contribution,
            mobileNo,
            onboardingDate: new Date(parseInt(onboardingDate) * 1000),
          });
        }
      );
    mainContract.methods.pot().call().then(setPotAmount);
    mainContract.methods
      .getCurrentMonth()
      .call()
      .then((currentMonth) =>
        mainContract.methods
          .compensationAmount(currentMonth, userAddress)
          .call()
      )
      .then(setPendingCompensations);
  }, [mainContract, userAddress]);

  const sendOTP = async (amount) => {
    setAmount(amount);
    mainContract.methods
      .preContributeVerification(amount)
      .send({ from: userAddress })
      .then(({ transactionHash, status }) => {
        console.log(`Send OTP status ${status} txHash ${transactionHash}`);
        // loadValues();
        setDialogOpen(false);
        setOtpOpen(true);
      });
  };

  const verifyOTP = (otp, amount) => {
    mainContract.methods
      .contribute(otp, amount)
      .send({ from: userAddress })
      .then(({ transactionHash, status }) => {
        console.log(`Verify OTP status ${status} txHash ${transactionHash}`);
        loadValues();
        setOtpOpen(false);
      });
  };

  const sendPayoutOTP = () => {
    mainContract.methods
      .prePayoutVerification()
      .send({ from: userAddress })
      .then(({ transactionHash, status }) => {
        console.log(
          `Prepayout Send OTP status ${status} txHash ${transactionHash}`
        );
        // loadValues();
        setPayoutOpen(true);
      });
  };

  const verifyPayoutOTP = (otp) => {
    mainContract.methods
      .payoutCompensation(otp)
      .send({ from: userAddress })
      .then(({ transactionHash, status }) => {
        console.log(
          `Payout Verify OTP status ${status} txHash ${transactionHash}`
        );
        loadValues();
        setPayoutOpen(false);
      });
  };

  useEffect(() => {
    loadValues();
  }, [loadValues]);

  return (
    <Page>
      <div style={{}}>
        <RUPBalance />
        <Paper title="Member">
          <img src={farmer} style={{ width: "4rem", height: "4rem" }}></img>

          <Typography variant="subtitle1">
            Connected member: {memberDetails.name} (
            {"Village: " + memberDetails.village}) (
            {"Group Id: " + memberDetails.groupId})
          </Typography>
          <Typography variant="subtitle1">
            Onboarding date: {formatDate(memberDetails.onboardingDate)}
          </Typography>
          <Typography variant="subtitle1">
            Member contribution / total contribution:{" "}
            {memberDetails.contribution} / {potAmount} RUP
          </Typography>
          <Typography variant="subtitle1">
            Member pending compensations for current month:{" "}
            {pendingCompensations} RUP
          </Typography>
          <div style={{ display: "flex" }}>
            <Box mt={2}>
              <Button
                variant="contained"
                color="primary"
                onClick={() => setDialogOpen(true)}
              >
                Contribute
              </Button>
            </Box>

            <Box mt={2} style={{ marginLeft: "10px" }}>
              <Button
                variant="contained"
                color="primary"
                style={{
                  color: "white",
                  backgroundColor:
                    pendingCompensations === "0" ? "grey" : "green",
                }}
                onClick={() => sendPayoutOTP()}
                disabled={pendingCompensations === "0"}
              >
                Compensation
              </Button>
            </Box>
          </div>
        </Paper>
      </div>

      <ContributeDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onContribute={sendOTP}
      />

      <VerifyOTPDialog
        open={otpOpen}
        onClose={() => setOtpOpen(false)}
        verifyOTP={verifyOTP}
        amount={amount}
        mobileNo={memberDetails.mobileNo}
      />

      <PayoutOTPDialog
        open={payoutOpen}
        onClose={() => setPayoutOpen(false)}
        verifyOTP={verifyPayoutOTP}
        mobileNo={memberDetails.mobileNo}
      />
    </Page>
  );
};

export default HomeMember;
