import { palette } from "./palette";

// Светлая тема
export const lightTheme = {
    primary: palette.primary,
    primaryDark: palette.primaryDark,
    background: palette.gray100,

    primaryText: palette.black,
    secondaryText: palette.gray500,
    headerText: palette.white,
    alternativeText: palette.white,

    surface: palette.white,
    hover: palette.gray200,
    border: palette.gray300,

    success: palette.green,
    error: palette.red,

    profit: palette.green,
    loss: palette.red,

    danger: palette.red,

    chart: {
        primary: palette.primary,
        secondary: palette.purple,
        tertiary: palette.pink,

        positive: palette.green,
        negative: palette.red,
    }
}