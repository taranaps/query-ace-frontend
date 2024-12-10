// src/theme/theme.ts

import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    background: {
      default: "#F2F2F2",
      paper: "#FFFFFF",
    },
    primary: {
      main: "#FF9500",
    },
    text: {
      primary: "#292D32",
      secondary: "#B5B7C0",
    },
    success: {
      main: "#16C098",
      contrastText: "#008767",
    },
    error: {
      main: "#FFC5C5",
      contrastText: "#DF0404",
    },
    info: {
      main: "#71839B",
    },
  },
  typography: {
    fontFamily: `'Poppins', 'Montserrat', sans-serif`,
    h1: {
      fontSize: "24px",
      fontWeight: 600,
      color: "#000000",
    },
    h2: {
      fontSize: "22px",
      fontWeight: 600,
      color: "#000000",
    },
    body1: {
      fontSize: "16px",
      color: "#324054",
    },
    body2: {
      fontSize: "14px",
      color: "#71839B",
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 600,
          borderRadius: "8px",
          "&.Mui-active": {
            backgroundColor: "#16C098",
            border: "1px solid #00B087",
            color: "#008767",
          },
          "&.Mui-inactive": {
            backgroundColor: "#FFC5C5",
            border: "1px solid #DF0404",
            color: "#DF0404",
          },
        },
      },
    },
  },
});

export default theme;
