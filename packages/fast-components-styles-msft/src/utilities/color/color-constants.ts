import { ColorPaletteConfig, parseColorHexRGB } from "@microsoft/fast-colors";

export const white: string = "#FFFFFF";
export const black: string = "#000000";

const paletteConstants: Partial<ColorPaletteConfig> = {
    steps: 94,
    clipLight: 0,
    clipDark: 0,
};

/**
 * @deprecated
 */
export const neutralPaletteConfig: ColorPaletteConfig = {
    ...paletteConstants,
};

/**
 * @deprecated
 */
export const accentPaletteConfig: ColorPaletteConfig = {
    ...paletteConstants,
    baseColor: parseColorHexRGB("#0078D4"),
};
