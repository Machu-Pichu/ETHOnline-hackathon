import React from 'react';

import {
  makeStyles,
  Paper as MuiPaper,
  Typography,
} from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(2),
  },
  pageTitle: {
    marginBottom: theme.spacing(1),
  },
}));

const Paper = ({ title, children }) => {
  const classes = useStyles();
  return (
    <MuiPaper className={classes.paper}>
      { title !== null && (
        <Typography variant="h6" className={classes.pageTitle}>
          { title }
        </Typography>
      )}
      { children ? children : '' }
    </MuiPaper>
  );
};

export default Paper;
