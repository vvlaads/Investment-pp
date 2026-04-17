import { palette } from "./palette";

// Темная тема
export const darkTheme = {
    primary: palette.primary,
    primaryDark: palette.primaryMedium,

    background: palette.gray900,
    surface: palette.gray800,

    primaryText: palette.gray50,
    secondaryText: palette.gray400,
    headerText: palette.white,
    alternativeText: palette.white,

    border: palette.gray700,
    hover: palette.gray600,

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