import React, { useContext, useEffect, useState } from "react";

import { Typography } from "@material-ui/core";

import { AppContext } from "../AppContext";

import Page from "../components/Page";
import Paper from "../components/Paper";

const Registration = () => {
  const {
    userAddress,
    web3provider,
    tokenContract,
    userContract,
    mainContract,
  } = useContext(AppContext);
  const [network, setNetwork] = useState(null);
  const [userRole, setUserRole] = useState(null);

  // On page loading, retrieve network infos
  useEffect(() => {
    console.log(userAddress, "useraddress");
    console.log(web3provider, "web3provider");
    console.log(tokenContract, "tokenCOntract");
    console.log(userContract, "usercontarct");
    console.log(mainContract, "mainContarct");

    web3provider.eth.net.getNetworkType().then(setNetwork);

    isAddressRegistered();
  }, []);

  const isAddressRegistered = async () => {
    try {
      const temp = await userContract.methods.getUserRole(userAddress).call();
      console.log(temp, "user role");
      setUserRole(0);
    } catch (e) {
      console.log(e, "error");
    }
  };

  const renderPage = () => {
    switch (userRole) {
      case 0:
        return <div>Member page</div>;
      case 1:
        return <div>Watcher Page</div>;
      case 2:
        return <div>Enabler Page</div>;
      default:
        return <div>Registration page</div>;
    }
  };

  return (
    <Page>
      <Paper title="Welcome">
        <Typography variant="subtitle1">
          Connected user: {userAddress}
        </Typography>
        {network && (
          <Typography variant="subtitle1">
            Connected network: {network}
          </Typography>
        )}
        {renderPage()}
      </Paper>
    </Page>
  );
};

export default Registration;
