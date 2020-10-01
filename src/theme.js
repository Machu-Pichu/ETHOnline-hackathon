import { createMuiTheme } from '@material-ui/core/styles';

import { 
  teal,
} from '@material-ui/core/colors';

const theme = createMuiTheme({
  palette: {
    primary: teal,
  },
  typography: {
    fontFamily: '\'Noto Sans JP\', sans-serif',
  },
});

export default theme;
