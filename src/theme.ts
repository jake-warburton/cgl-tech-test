import { createTheme } from "@mui/material";

//  Palette and shape taken from the design mock. The pink accent fails
//  WCAG contrast as text on white, so it is reserved for fills such as
//  the PICK-UP chip, never for text or icons carrying meaning alone.
export const theme = createTheme({
  palette: {
    primary: { main: "#5e1b6d", dark: "#4a1557" },
    secondary: { main: "#004a81" },
    error: { main: "#b3261e" },
    background: { default: "#f4f3f6" },
    text: { primary: "#1c1b1f", secondary: "#49454f" },
    //  the light grey used for pill and placeholder borders
    divider: "#d7d3dc",
  },
  typography: {
    fontFamily: "'Montserrat', system-ui, sans-serif",
  },
  shape: {
    borderRadius: 8,
  },
});
