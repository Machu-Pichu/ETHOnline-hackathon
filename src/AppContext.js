import React, { useState } from 'react';

const AppContext = React.createContext();

const AppContextProvider = ({ children }) => {
  // eslint-disable-next-line
  const [ web3provider, setWeb3Provider ] = useState(null);
  const [ userAddress, setUserAddress ] = useState(null);
  
  const context = {
    authenticated: userAddress !== null,
    userAddress,
    web3provider,

    onUserConnected: (userAddress, provider) => {
      setWeb3Provider(provider);
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
