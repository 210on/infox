import { createTheme } from "@mui/material";

export const theme = createTheme({
  palette: {
    primary: {
      main: "#ff0000",
    },
    secondary: {
      main: "#ffffff",
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
