import { DesignSystem, withDesignSystemDefaults } from "../design-system";
import { ComponentStyles, ComponentStyleSheet } from "@microsoft/fast-jss-manager";
import { AutoSuggestClassNameContract } from "@microsoft/fast-components-class-name-contracts-msft";
import { add, format, multiply, toPx } from "@microsoft/fast-jss-utilities";
import { applyElevatedCornerRadius } from "../utilities/border";
import { neutralFillStealthRest } from "../utilities/color";
import { heightNumber } from "../utilities/density";
import { applyElevation, ElevationMultiplier } from "../utilities/elevation";
import { designUnit, outlineWidth } from "../utilities/design-system";
import { highContrastSelector } from "../utilities/high-contrast";

const visibleChildCount: number = 10;
const styles: ComponentStyles<AutoSuggestClassNameContract, DesignSystem> = {
    autoSuggest: {
        minWidth: "276px",
        maxWidth: "374px",
    },
    autoSuggest_menu: {
        ...applyElevation(ElevationMultiplier.e11),
        background: neutralFillStealthRest,
        zIndex: "1",
        position: "absolute",
        width: "100%",
        margin: "0",
        padding: format("{0} 0", toPx(designUnit)),
        marginTop: toPx(designUnit),
        maxWidth: "374px",
        minWidth: "276px",
        maxHeight: toPx(add(heightNumber(visibleChildCount), multiply(designUnit, 2))),
        overflow: "auto",
        ...applyElevatedCornerRadius(),
        [highContrastSelector]: {
            background: "ButtonFace",
            border: format<DesignSystem>("{0} solid ButtonText", toPx(outlineWidth)),
        },
    },
    autoSuggest__menuOpen: {},
};

export default styles;
