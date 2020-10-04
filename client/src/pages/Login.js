import React, { useState, useEffect, useCallback, useContext } from 'react';
import Web3 from 'web3';
import Portis from '@portis/web3';
import metamask from '../assets/images/metamask.jpg';
import portis from '../assets/images/portis.png';
import machupicchu from '../assets/images/machupicchu.jpg';
import CircularProgress from '@material-ui/core/CircularProgress';

import {
  Alert,
} from '@material-ui/lab';

import {
  Button,
} from '@material-ui/core';

import { AppContext } from '../AppContext';
import Page from '../components/Page';
import Paper from '../components/Paper';

const Login = () => {
  const { onUserConnected } = useContext(AppContext);
  const [ web3Provider, setWeb3Provider ] = useState(null);
  const [loader, setLoader] = useState(false);
  
  // On page init, test if `window.ethereum` exists and init web3 provider
  useEffect(() => {
    if(window.ethereum) {
      setWeb3Provider(new Web3(window.ethereum));
    }
  }, []);

  const handleMetamaskConnect = useCallback(() => {
    setLoader(true);
    window.ethereum
      .enable()
      .then((accounts) => {
        if(accounts && accounts.length > 0) {
          // Select the first account
          onUserConnected(accounts[0], web3Provider);
        }
      })
      .catch((error) => {
        // User rejects the connection
        console.error(error);
      });
      setLoader(false);
  });

  const handlePortisConnect = useCallback(() => {
      setLoader(true);
      const portis = new Portis('0014ccd5-8940-49ab-85e8-178c470dca32', 'kovan');
      const web3 = new Web3(portis.provider);
      web3.eth.getAccounts((error, accounts) => {
        console.log(accounts);
        if(accounts && accounts.length > 0) {
          // Select the first account
          onUserConnected(accounts[0], web3);
        }
      })
      .catch((error) => {
        // User rejects the connection
        console.error(error);
      });
      setLoader(false);
  });

  return (
        <div style={{width:'100%', height:'100%'}}>
          <div style={{ backgroundColor:'#2e66a7', display:'flex', alignItems:'center', justifyContent:'center', height:'10rem'}}>
           <img src={machupicchu} style={{width:'5rem', height:'5rem'}} /> <span style={{color:'white', fontSize:'60px', marginLeft:'0.5rem'}}>Machu Picchu : Farmer's friend</span>
          </div>
          <div style={{display:'flex', alignItems:'center', justifyContent:'center', fontSize:'30px', marginTop:'1rem'}}>
            Connect a wallet to start
          </div>
          {
            loader ? 
            <CircularProgress></CircularProgress> :
            <div style={{display:'flex',justifyContent:'center', marginTop:'1rem', alignItems:'center'}}>
            {
              web3Provider ? (
                <>
                <div style={{width:'20rem', height:'18rem', background:'orange', cursor:'pointer'}} onClick={handleMetamaskConnect}>
                    <img src={metamask} style={{width:'18rem', height:'12rem', padding:'1rem'}}></img>
                    <span style={{padding:'1rem', fontSize:'20px', marginLeft:'35%'}}>Metamask</span>
                 </div>
                <div style={{width:'20rem', height:'18rem', background:'#2e66a7', marginLeft:'1rem', cursor:'pointer'}} onClick={handlePortisConnect}>
                    <img src={portis} style={{width:'18rem', height:'12rem', padding:'1rem'}}></img>
                    <span style={{padding:'1rem', fontSize:'20px', marginLeft:'37%'}}>Portis</span>
                </div>
            </>
              ) : (
                <div style={{width:'20rem', height:'18rem', background:'#2e66a7', marginLeft:'1rem'}} onClick={handlePortisConnect}>
                <img src={portis} style={{width:'18rem', height:'12rem', padding:'1rem'}}></img>
                <span style={{padding:'1rem', fontSize:'20px', marginLeft:'37%'}}>Portis</span>
                </div>
              )
            }

          </div>
          }
        
        </div>
  );
};

export default Login;