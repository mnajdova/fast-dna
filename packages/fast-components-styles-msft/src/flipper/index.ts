import { DesignSystem } from "../design-system";
import { ComponentStyles } from "@microsoft/fast-jss-manager";
import { FlipperClassNameContract } from "@microsoft/fast-components-class-name-contracts-msft";
import {
    applyFocusVisible,
    directionSwitch,
    format,
    toPx,
} from "@microsoft/fast-jss-utilities";
import {
    neutralFillStealthActive,
    neutralFillStealthHover,
    neutralFillStealthRest,
    neutralFocus,
    neutralForegroundRest,
    neutralOutlineActive,
    neutralOutlineHover,
    neutralOutlineRest,
} from "../utilities/color";
import { glyphSize, height } from "../utilities/density";
import { outlineWidth } from "../utilities/design-system";
import { applyCursorPointer } from "../utilities/cursor";
import { highContrastSelector } from "../utilities/high-contrast";

const styles: ComponentStyles<FlipperClassNameContract, DesignSystem> = {
    flipper: {
        ...applyCursorPointer(),
        width: height(),
        height: height(),
        display: "inline-flex",
        justifyContent: "center",
        alignItems: "center",
        margin: "0",
        position: "relative",
        fill: neutralForegroundRest,
        color: neutralForegroundRest,
        background: "transparent",
        border: "none",
        padding: "0",
        "&::before": {
            transition: "all 0.1s ease-in-out",
            content: "''",
            opacity: "0.8",
            background: neutralFillStealthRest,
            border: format(
                "{0} solid {1}",
                toPx<DesignSystem>(outlineWidth),
                neutralOutlineRest
            ),
            borderRadius: "50%",
            position: "absolute",
            top: "0",
            right: "0",
            bottom: "0",
            left: "0",
            [highContrastSelector]: {
                background: "ButtonFace",
            },
        },
        "&:active": {
            "&::before": {
                background: neutralFillStealthActive,
                borderColor: neutralOutlineActive,
            },
        },
        "&:hover": {
            "&::before": {
                background: neutralFillStealthHover,
                borderColor: neutralOutlineHover,
                [highContrastSelector]: {
                    background: "Highlight",
                },
            },
            "& $flipper_glyph": {
                [highContrastSelector]: {
                    fill: "HighlightText",
                },
            },
        },
        ...applyFocusVisible({
            "&::before": {
                boxShadow: format<DesignSystem>("0 0 0 1px {0} inset", neutralFocus),
                border: neutralFocus,
            },
        }),
        "&::-moz-focus-inner": {
            border: "0",
        },
        [highContrastSelector]: {
            fill: "ButtonText",
        },
    },
    flipper_glyph: {
        position: "relative",
        transform: directionSwitch("none", "rotate(180deg)"),
        width: glyphSize,
        height: glyphSize,
    },
    flipper__next: {},
    flipper__previous: {},
};

export default styles;
