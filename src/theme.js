import { createTheme } from '@mui/material/styles';
import { orange } from '@mui/material/colors';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#000000', // black text and labels
    },
    secondary: {
      main: orange[500], // orange for buttons, highlights
    },
    background: {
      default: '#fefecb', // pale yellow background
    },
  },
  typography: {
    fontFamily: 'Inter, sans-serif',
    button: {
      fontWeight: 600,
      textTransform: 'none',
    },
  },
});

export default theme;
