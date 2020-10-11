import React, { useContext, useEffect, useState } from "react";

import { Typography } from "@material-ui/core";

import { AppContext } from "../AppContext";

import Page from "../components/Page";
import Paper from "../components/Paper";

const Home = () => {
  const {
    userAddress,
  } = useContext(AppContext);
  
  return (
    <Page>
      <Paper title="Welcome">
        <Typography variant="subtitle1">
          Connected user: {userAddress}
        </Typography>
      </Paper>
    </Page>
  );
};

export default Home;
