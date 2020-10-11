import React, { useContext } from "react";

import { Typography } from "@material-ui/core";

import { AppContext } from "../AppContext";

import Page from "../components/Page";
import Paper from "../components/Paper";

const HomeEnabler = () => {
  const {
    userAddress,
  } = useContext(AppContext);
  
  return (
    <Page>
      <Paper title="Enabler">
        
      </Paper>
    </Page>
  );
};

export default HomeEnabler;
