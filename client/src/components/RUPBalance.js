import React, { useEffect, useState, useContext, useCallback } from "react";

import { Button, Box } from "@material-ui/core";

import { AppContext } from "../AppContext";
import Paper from "./Paper";
import rupeetoken from "../assets/images/rupeetoken.jpg";

const RUPBalance = () => {
  const { tokenContract, userAddress, isPortis } = useContext(AppContext);
  const [balance, setBalance] = useState(0);

  const loadValues = useCallback(() => {
    tokenContract.methods.balanceOf(userAddress).call().then(setBalance);
  }, [tokenContract, userAddress]);

  useEffect(() => {
    loadValues();
  }, [loadValues]);
  return (
    <Paper title="My RUP Balance">
      <div
        style={{ display: "flex", alignItems: "center", marginBottom: "5px" }}
      >
        <img src={rupeetoken} style={{ width: "50px", height: "50px" }}></img>
        <Box mb={2} style={{ marginLeft: "10px" }}>
          {balance} RUP{" "}
        </Box>
      </div>
      <Button color="primary" variant="contained" onClick={loadValues}>
        Refresh
      </Button>

      {isPortis && (
        <Button
          color="primary"
          variant="contained"
          onClick={() => {
            isPortis.showPortis();
          }}
          style={{ marginLeft: "5px" }}
        >
          Wallet
        </Button>
      )}
    </Paper>
  );
};

export default RUPBalance;
