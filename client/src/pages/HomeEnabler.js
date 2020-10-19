import React, { useState, useContext } from "react";
import enabler from "../assets/images/enabler.jpeg";

import { Button, CircularProgress } from "@material-ui/core";

import { AppContext } from "../AppContext";

import Page from "../components/Page";
import Paper from "../components/Paper";

const HomeEnabler = () => {
  const { userAddress, mainContract } = useContext(AppContext);

  const [loading, setLoading] = useState(false);

  const calculateCompensation = () => {
    setLoading(true);
    mainContract.methods
      .calcCompensation()
      .send({ from: userAddress })
      .then(({ transactionHash, status }) => {
        console.log(
          `calcCompensation transaction status ${status} txhash ${transactionHash}`
        );
        setLoading(false);
      });
  };

  return (
    <Page>
      <Paper title="Enabler">
        <img src={enabler} style={{ width: "6rem", height: "6rem" }}></img>
        {loading ? (
          <CircularProgress />
        ) : (
          <Button
            variant="contained"
            color="primary"
            onClick={calculateCompensation}
          >
            Calculate compensations
          </Button>
        )}
      </Paper>
    </Page>
  );
};

export default HomeEnabler;
