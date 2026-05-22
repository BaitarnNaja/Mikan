import { createTheme } from "@mui/material/styles";
import "@mui/material/styles";
import { baseTypography } from "./typography";

declare module "@mui/material/styles" {

  interface Palette {
    main: string
  }

  interface PaletteOptions {
    main?: string
  }

}
export const globalTheme = createTheme({

  typography: {
    fontFamily: "Andika, Noto Sans Thai, sans-serif",
      h1: baseTypography.displayLg,
      h2: baseTypography.displayMd,
      h3: baseTypography.displaysm,
      h4: baseTypography.displayss,
      body1: baseTypography.bodyLg,
      body2: baseTypography.bodyMd,
      caption: baseTypography.bodySm
  }

});