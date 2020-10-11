import React from 'react';

import machupicchu from '../assets/images/machupicchu.jpg';

import {
  AppBar as MuiAppBar,
  makeStyles,
} from '@material-ui/core';

const useStyles = makeStyles(() => ({
  root: {
    backgroundColor:'#2e66a7',
    display:'flex',
    alignItems:'center',
    justifyContent:'center',
    height:'10rem',
  },
  icon: {
    width:'5rem',
    height:'5rem',
  },
  title: {
    color:'white',
    fontSize:'60px',
    marginLeft:'0.5rem',
  },
}));

const AppBar = () => {
  const classes = useStyles();
  return (
    <MuiAppBar position="static">
      <div className={classes.root}>
        <img src={machupicchu} className={classes.icon} alt="MP icon" />
        <span className={classes.title}>
          Machu Picchu : Farmer's friend
        </span>
      </div>
    </MuiAppBar>
  )
};

export default AppBar;
