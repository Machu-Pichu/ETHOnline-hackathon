import React, { useState } from 'react';

const AppContext = React.createContext();

const AppContextProvider = ({ children }) => {
  // eslint-disable-next-line
  const [ web3provider, setWeb3Provider ] = useState(null);
  const [ userAddress, setUserAddress ] = useState(null);
  const [tokenContract, setTokenContract] = useState(null);
  const [userContract, setUserContract] = useState(null);
  const [mainContract, setMainContract] = useState(null);
  
  
  const context = {
    authenticated: userAddress !== null,
    userAddress,
    web3provider,
    tokenContract,
    userContract,
    mainContract,
    onUserConnected: (userAddress, provider, tokenContract, userContract, mainContract) => {
      setWeb3Provider(provider);
      setTokenContract(tokenContract);
      setUserContract(userContract);
      setMainContract(mainContract);
      setUserAddress(userAddress);
    },
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
