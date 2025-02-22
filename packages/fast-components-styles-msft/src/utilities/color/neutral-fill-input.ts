import { DesignSystem, DesignSystemResolver } from "../../design-system";
import {
    findClosestBackgroundIndex,
    getSwatch,
    isDarkMode,
    palette,
    Palette,
    PaletteType,
} from "./palette";
import {
    ColorRecipe,
    colorRecipeFactory,
    FillSwatchFamily,
    Swatch,
    swatchFamilyToSwatchRecipeFactory,
    SwatchFamilyType,
    SwatchRecipe,
    SwatchResolver,
} from "./common";
import {
    backgroundColor,
    neutralFillInputActiveDelta,
    neutralFillInputHoverDelta,
    neutralFillInputRestDelta,
    neutralFillInputSelectedDelta,
} from "../design-system";

/**
 * Algorithm for determining neutral backplate colors
 */
function neutralFillInputAlgorithm(
    indexResolver: DesignSystemResolver<number>
): DesignSystemResolver<Swatch> {
    return (designSystem: DesignSystem): Swatch => {
        const direction: 1 | -1 = isDarkMode(designSystem) ? -1 : 1;
        return getSwatch(
            findClosestBackgroundIndex(designSystem) -
                indexResolver(designSystem) * direction,
            palette(PaletteType.neutral)(designSystem)
        );
    };
}

export const neutralFillInput: ColorRecipe<FillSwatchFamily> = colorRecipeFactory(
    (designSystem: DesignSystem): FillSwatchFamily => {
        return {
            rest: neutralFillInputRest(designSystem),
            hover: neutralFillInputHover(designSystem),
            active: neutralFillInputActive(designSystem),
            selected: neutralFillInputSelected(designSystem),
        };
    }
);

export const neutralFillInputRest: SwatchRecipe = colorRecipeFactory(
    neutralFillInputAlgorithm(neutralFillInputRestDelta)
);
export const neutralFillInputHover: SwatchRecipe = colorRecipeFactory(
    neutralFillInputAlgorithm(neutralFillInputHoverDelta)
);
export const neutralFillInputActive: SwatchRecipe = colorRecipeFactory(
    neutralFillInputAlgorithm(neutralFillInputActiveDelta)
);
export const neutralFillInputSelected: SwatchRecipe = colorRecipeFactory(
    neutralFillInputAlgorithm(neutralFillInputSelectedDelta)
);
