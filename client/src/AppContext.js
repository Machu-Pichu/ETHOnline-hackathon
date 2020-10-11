import React, { useState } from 'react';

import RUP from "./contracts/RUP.json";
import User from "./contracts/User.json";
import MachuPicchu from "./contracts/MachuPicchu.json";

const loadContracts = (web3provider, networkId) => {
  const RUPDeployed = RUP.networks[networkId];
  const UserDeployed = User.networks[networkId];
  const MachuPicchuDeployed = MachuPicchu.networks[networkId];
  return Promise.all([
    new web3provider.eth.Contract(
      RUP.abi,
      RUPDeployed.address
    ),
    new web3provider.eth.Contract(
      User.abi,
      UserDeployed.address
    ),
    new web3provider.eth.Contract(
      MachuPicchu.abi,
      MachuPicchuDeployed.address
    ),
  ]);
};

const getUserRole = (userContract, userAddress) => {
  return userContract.methods
    .getUserRole(userAddress)
    .call()
    .then((roleId) => { 
      console.log(`Get current user role for ${userAddress}: ${roleId}`);
      switch(roleId) {
        case '0': return 'member';
        case '1': return 'watcher';
        case '2': return 'enabler';
        default: return null;
      }
    })
    .catch((e) => {
      // User is not registered
      return null;
    });
};

const AppContext = React.createContext();

const AppContextProvider = ({ children }) => {
  const [ web3provider, setWeb3Provider ] = useState(null);
  
  const [ userAddress, setUserAddress ] = useState(null);
  const [ userRole, setUserRole ] = useState(null);

  const [ tokenContract, setTokenContract ] = useState(null);
  const [ userContract, setUserContract ] = useState(null);
  const [ mainContract, setMainContract ] = useState(null);
  
  const context = {
    authenticated: userAddress !== null,
    userAddress,
    userRole,
    web3provider,
    tokenContract,
    userContract,
    mainContract,

    onUserConnected: async (userAddress, provider) => {
      setWeb3Provider(provider);

      // Currently, kovan is hard-coded here
      const [ token, user, main ] = await loadContracts(provider, 42);
      setTokenContract(token);
      setUserContract(user);
      setMainContract(main);
      
      // Handle metamask account changes
      window.ethereum.on('accountsChanged', async ([selectedAccount]) => {
        const role = await getUserRole(user, selectedAccount);
        setUserAddress(selectedAccount);
        setUserRole(role);
      });

      // TODO: handle metamask network changes
      /*window.ethereum.on('networkChanged', (evt) => {
        
      });*/

      provider.eth
        .getAccounts()
        .then(async (accounts) => {
          const selectedAccount = (accounts !== null && accounts.length >= 1 ? accounts[0] : null);
          if (selectedAccount !== userAddress && selectedAccount !== null) {
            const role = await getUserRole(user, selectedAccount);
            setUserAddress(selectedAccount);
            setUserRole(role);
          }
        });
    },

    onUserRegistered: async () => {
      const role = await getUserRole(userContract, userAddress);
      setUserRole(role);
    }
  };

  return (
    <AppContext.Provider value={context}>
      { children }
    </AppContext.Provider>
  )
};

export {
  AppContextProvider,
  AppContext,
};
