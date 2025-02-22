import { DesignSystem, DesignSystemResolver } from "../design-system";
import {
    accentFillRest,
    accentForegroundCut,
    neutralFillInputActive,
    neutralFillInputHover,
    neutralFillInputRest,
    neutralFillSelected,
    neutralFocus,
    neutralFocusInnerAccent,
    neutralForegroundRest,
    neutralOutlineActive,
    neutralOutlineHover,
    neutralOutlineRest,
} from "../utilities/color";
import { ComponentStyles } from "@microsoft/fast-jss-manager";
import {
    add,
    applyFocusVisible,
    directionSwitch,
    divide,
    format,
    multiply,
    subtract,
    toPx,
} from "@microsoft/fast-jss-utilities";
import { ToggleClassNameContract } from "@microsoft/fast-components-class-name-contracts-base";
import { applyDisabledState } from "../utilities/disabled";
import { applyScaledTypeRamp } from "../utilities/typography";
import { densityCategorySwitch, heightNumber } from "../utilities/density";
import { designUnit, focusOutlineWidth, outlineWidth } from "../utilities/design-system";
import { applyCursorDisabled, applyCursorPointer } from "../utilities/cursor";
import {
    highContrastBackground,
    highContrastBorderColor,
    highContrastDoubleFocus,
    highContrastSelector,
} from "../utilities/high-contrast";

const height: DesignSystemResolver<number> = add(divide(heightNumber(), 2), designUnit);
const width: DesignSystemResolver<number> = multiply(height, 2);

const indicatorMargin: DesignSystemResolver<number> = add(
    designUnit,
    densityCategorySwitch(0, 1, 2)
);
const indicatorSize: DesignSystemResolver<number> = subtract(
    height,
    multiply(indicatorMargin, 2)
);
const indicatorCheckedLeft: DesignSystemResolver<number> = subtract(
    width,
    indicatorMargin,
    indicatorSize
);

const styles: ComponentStyles<ToggleClassNameContract, DesignSystem> = {
    toggle: {
        display: "inline-block",
        color: neutralForegroundRest,
        transition: "all 0.2s ease-in-out",
    },
    toggle_label: {
        ...applyCursorPointer(),
        ...applyScaledTypeRamp("t7"),
        display: "block",
        paddingBottom: "7px",
        clear: "both",
    },
    toggle_toggleButton: {
        ...applyCursorPointer(),
        position: "relative",
        marginTop: "0",
        float: directionSwitch("left", "right"),
    },
    toggle_stateIndicator: {
        position: "absolute",
        pointerEvents: "none",
        top: toPx(indicatorMargin),
        left: toPx(indicatorMargin),
        transition: "all .1s ease",
        borderRadius: toPx(indicatorSize),
        width: toPx(indicatorSize),
        height: toPx(indicatorSize),
        background: neutralForegroundRest,
        ...highContrastBackground,
    },
    toggle_input: {
        ...applyCursorPointer(),
        position: "relative",
        margin: "0",
        width: toPx(width),
        height: toPx(height),
        background: neutralFillInputRest,
        border: format(
            "{0} solid {1}",
            toPx<DesignSystem>(outlineWidth),
            neutralOutlineRest
        ),
        borderRadius: toPx(height),
        appearance: "none",
        outline: "none",
        "&:active": {
            background: neutralFillInputActive,
            borderColor: neutralOutlineActive,
            [highContrastSelector]: {
                background: "Highlight",
                "& + span": {
                    background: "HighlightText",
                },
            },
        },
        "&:hover": {
            background: neutralFillInputHover,
            borderColor: neutralOutlineHover,
            [highContrastSelector]: {
                borderColor: "Highlight",
                "& + span": {
                    background: "Highlight",
                },
            },
        },
        ...applyFocusVisible({
            boxShadow: format<DesignSystem>("0 0 0 1px {0} inset", neutralFocus),
            borderColor: neutralFocus,
            [highContrastSelector]: {
                boxShadow: format<DesignSystem>(
                    "0 0 0 {0} ButtonText inset",
                    toPx<DesignSystem>(outlineWidth)
                ),
            },
        }),
        ...highContrastBorderColor,
    },
    toggle__checked: {
        "& $toggle_input": {
            background: accentFillRest,
            borderColor: accentFillRest,
            ...applyFocusVisible({
                boxShadow: format<DesignSystem>(
                    "0 0 0 {0} {1} inset, 0 0 0 {2} {3} inset",
                    toPx(subtract(focusOutlineWidth, outlineWidth)),
                    neutralFocus,
                    toPx(add(focusOutlineWidth, outlineWidth)),
                    neutralFocusInnerAccent(accentFillRest)
                ),
                borderColor: neutralFocus,
                ...highContrastDoubleFocus,
            }),
            "&:disabled": {
                [highContrastSelector]: {
                    background: "GrayText !important",
                    borderColor: "GrayText !important",
                    "& + span": {
                        background: "Background !important",
                    },
                },
            },
            [highContrastSelector]: {
                background: "Highlight",
                borderColor: "Highlight",
                "&:hover": {
                    background: "HighlightText",
                    borderColor: "Highlight",
                },
                "&:active": {
                    [highContrastSelector]: {
                        background: "Highlight",
                        "& + span": {
                            background: "HighlightText",
                        },
                    },
                },
            },
        },
        "& $toggle_stateIndicator": {
            left: toPx(indicatorCheckedLeft),
            background: accentForegroundCut,
            [highContrastSelector]: {
                background: "HighlightText",
            },
            "&:hover": {
                [highContrastSelector]: {
                    background: "Highlight",
                },
            },
        },
    },
    toggle__disabled: {
        ...applyDisabledState(),
        "& $toggle_input, & $toggle_label, & $toggle_statusMessage": {
            ...applyCursorDisabled(),
            background: neutralFillSelected,
            borderColor: neutralFillSelected,
            [highContrastSelector]: {
                background: "Background !important",
                borderColor: "GrayText !important",
                "& + span": {
                    background: "GrayText !important",
                },
            },
        },
    },
    toggle_statusMessage: {
        ...applyScaledTypeRamp("t7"),
        lineHeight: toPx(height),
        float: directionSwitch("left", "right"),
        paddingLeft: directionSwitch("5px", ""),
        paddingRight: directionSwitch("", "5px"),
        userSelect: "none",
        marginTop: "0",
        paddingBottom: "0",
    },
};

export default styles;
