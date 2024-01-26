import { createTheme } from "@mui/material";

export const theme = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 621,
      md: 768,
      lg: 1025,
      xl: 1536,
    },
  },

  palette: {
    primary: {
      main: "#a64242",
      dark: "#420606",
      light: "#f4d6d6",

    },
    secondary: {
      main: "#f6f6f6",
    },
  },
  typography: {
    fontFamily:
      "Noto Sans JP, Yu Gothic, Meiryo, Hiragino Kaku Gothic Pro, sans-serif",
    button: {
      textTransform: "none",
    },
  },
});
