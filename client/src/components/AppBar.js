import React from "react";

import machupicchu from "../assets/images/machupicchu.png";
import rupeetoken from "../assets/images/rupeetoken.jpg";

import { AppBar as MuiAppBar, makeStyles } from "@material-ui/core";

const useStyles = makeStyles(() => ({
  root: {
    backgroundColor: "#2e66a7",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "8rem",
  },
  icon: {
    width: "6rem",
    height: "6rem",
  },
  title: {
    color: "white",
    fontSize: "60px",
    marginLeft: "0.5rem",
  },
}));

const AppBar = () => {
  const classes = useStyles();
  return (
    <MuiAppBar position="static">
      <div className={classes.root}>
        <img src={machupicchu} className={classes.icon} alt="MP icon" />
        <span className={classes.title}>Machu Picchu : Farmer's friend</span>
        <img
          src={machupicchu}
          style={{ marginLeft: "10px" }}
          className={classes.icon}
          alt="MP icon"
        />
      </div>
    </MuiAppBar>
  );
};

export default AppBar;
