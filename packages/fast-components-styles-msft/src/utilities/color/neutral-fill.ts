import { DesignSystem, DesignSystemResolver } from "../../design-system";
import {
    neutralFillActiveDelta,
    neutralFillHoverDelta,
    neutralFillRestDelta,
    neutralFillSelectedDelta,
    neutralPalette,
} from "../design-system";
import {
    ColorRecipe,
    colorRecipeFactory,
    designSystemResolverMax,
    FillSwatchFamily,
    Swatch,
    SwatchRecipe,
} from "./common";
import { findClosestBackgroundIndex, getSwatch } from "./palette";

const neutralFillThreshold: DesignSystemResolver<number> = designSystemResolverMax(
    neutralFillRestDelta,
    neutralFillHoverDelta,
    neutralFillActiveDelta
);

function neutralFillAlgorithm(
    deltaResolver: DesignSystemResolver<number>
): DesignSystemResolver<Swatch> {
    return (designSystem: DesignSystem): Swatch => {
        const backgroundIndex: number = findClosestBackgroundIndex(designSystem);
        const swapThreshold: number = neutralFillThreshold(designSystem);
        const direction: 1 | -1 = backgroundIndex >= swapThreshold ? -1 : 1;

        return getSwatch(
            backgroundIndex + direction * deltaResolver(designSystem),
            neutralPalette(designSystem)
        );
    };
}

export const neutralFill: ColorRecipe<FillSwatchFamily> = colorRecipeFactory(
    (designSystem: DesignSystem): FillSwatchFamily => {
        return {
            rest: neutralFillRest(designSystem),
            hover: neutralFillHover(designSystem),
            active: neutralFillActive(designSystem),
            selected: neutralFillSelected(designSystem),
        };
    }
);

export const neutralFillRest: SwatchRecipe = colorRecipeFactory(
    neutralFillAlgorithm(neutralFillRestDelta)
);
export const neutralFillHover: SwatchRecipe = colorRecipeFactory(
    neutralFillAlgorithm(neutralFillHoverDelta)
);
export const neutralFillActive: SwatchRecipe = colorRecipeFactory(
    neutralFillAlgorithm(neutralFillActiveDelta)
);
export const neutralFillSelected: SwatchRecipe = colorRecipeFactory(
    neutralFillAlgorithm(neutralFillSelectedDelta)
);
