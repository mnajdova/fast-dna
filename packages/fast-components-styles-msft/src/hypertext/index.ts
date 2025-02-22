import { DesignSystem } from "../design-system";
import {
    accentForegroundActive,
    accentForegroundHover,
    accentForegroundRest,
    neutralFocus,
    neutralForegroundRest,
} from "../utilities/color";
import { ComponentStyles } from "@microsoft/fast-jss-manager";
import { HypertextClassNameContract } from "@microsoft/fast-components-class-name-contracts-base";
import { applyFocusVisible, format, toPx } from "@microsoft/fast-jss-utilities";
import { focusOutlineWidth, outlineWidth } from "../utilities/design-system";

const styles: ComponentStyles<HypertextClassNameContract, DesignSystem> = {
    hypertext: {
        outline: "none",
        textDecoration: "none",
        color: neutralForegroundRest,
        transition: "all 0.2s ease-in-out, border 0.03s ease-in-out",
        "&:link, &:visited": {
            borderBottom: format<DesignSystem>(
                "{0} solid {1}",
                toPx(outlineWidth),
                accentForegroundRest
            ),
            color: accentForegroundRest,
            "&:hover": {
                borderBottom: format<DesignSystem>(
                    "{0} solid {1}",
                    toPx(outlineWidth),
                    accentForegroundHover
                ),
                color: accentForegroundHover,
            },
            "&:active": {
                borderBottom: format<DesignSystem>(
                    "{0} solid {1}",
                    toPx(outlineWidth),
                    accentForegroundActive
                ),
                color: accentForegroundActive,
            },
            ...applyFocusVisible({
                borderBottom: format<DesignSystem>(
                    "{0} solid {1}",
                    toPx(focusOutlineWidth),
                    neutralFocus
                ),
            }),
        },
    },
};

export default styles;
