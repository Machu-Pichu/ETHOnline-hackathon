import React, { useState, useEffect, useCallback, useContext } from "react";
import Web3 from "web3";
import Portis from "@portis/web3";

import { makeStyles, Box } from "@material-ui/core";
import CircularProgress from "@material-ui/core/CircularProgress";

import { AppContext } from "../AppContext";
import metamask from "../assets/images/metamask.jpg";
import portis from "../assets/images/portis.png";
import rupeetoken from "../assets/images/rupeetoken.jpg";

const useStyles = makeStyles((theme) => ({
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "30px",
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  container: {
    display: "flex",
    justifyContent: "center",
  },
  walletIcon: {
    width: "18rem",
    height: "12rem",
    padding: theme.spacing(1),
  },
  walletButton: (props) => ({
    textAlign: "center",
    backgroundColor: props.backgroundColor,
    margin: theme.spacing(1),
    paddingBottom: theme.spacing(2),
    cursor: "pointer",
    color: "white",
  }),
}));

const WalletButton = ({ img, name, backgroundColor, onClick }) => {
  const classes = useStyles({ backgroundColor });
  return (
    <Box onClick={onClick} className={classes.walletButton}>
      <img className={classes.walletIcon} src={img} alt={`${name} icon`} />
      <Box>{name}</Box>
    </Box>
  );
};

const Login = () => {
  const classes = useStyles();

  const { onUserConnected } = useContext(AppContext);
  const [web3Provider, setWeb3Provider] = useState(null);
  const [loader, setLoader] = useState(false);

  // On page init, test if `window.ethereum` exists and init web3 provider
  useEffect(() => {
    if (window.ethereum) {
      setWeb3Provider(window.ethereum);
    }
  }, []);

  const handleMetamaskConnect = useCallback(() => {
    setLoader(true);
    window.ethereum
      .enable()
      .then((accounts) => {
        if (accounts && accounts.length > 0) {
          // Select the first account
          onUserConnected(accounts[0], web3Provider, false);
        }
      })
      .catch((error) => {
        // User rejects the connection
        console.error(error);
      });
    setLoader(false);
  }, [onUserConnected, web3Provider]);

  const handlePortisConnect = useCallback(() => {
    setLoader(true);
    const portis = new Portis("0014ccd5-8940-49ab-85e8-178c470dca32", "kovan", {
      gasRelay: true,
    });
    const web3 = new Web3(portis.provider);
    web3.eth
      .getAccounts((error, accounts) => {
        console.log(accounts);
        if (accounts && accounts.length > 0) {
          // Select the first account
          onUserConnected(accounts[0], portis.provider, portis);
        }
      })
      .catch((error) => {
        // User rejects the connection
        console.error(error);
      });
    setLoader(false);
  }, [onUserConnected, web3Provider]);

  return (
    <Box>
      <Box className={classes.header}>Connect a wallet to start:</Box>
      <Box className={classes.container}>
        {loader ? (
          <CircularProgress />
        ) : (
          <>
            {web3Provider && (
              <WalletButton
                name="MetaMask"
                img={metamask}
                backgroundColor="orange"
                onClick={handleMetamaskConnect}
              />
            )}
            <WalletButton
              name="Portis"
              img={portis}
              backgroundColor="#2e66a7"
              onClick={handlePortisConnect}
            />
          </>
        )}
      </Box>
    </Box>
  );
};

export default Login;
