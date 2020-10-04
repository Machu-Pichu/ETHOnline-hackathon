import React from 'react';

import {
  makeStyles,
  Container,
} from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  page: {
    width: '100%',
    height: 'calc(100% - 64px)',
    padding: theme.spacing(3),
  }
}));

const Page = ({ children }) => {
  const classes = useStyles();
  return (
    <div className={classes.page}>
      <Container maxWidth="lg">
        { children && children }
      </Container>
    </div>
  );
};

export default Page;