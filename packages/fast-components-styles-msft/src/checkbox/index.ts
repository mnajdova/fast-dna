import {
    densityCategorySwitch,
    heightNumber,
    horizontalSpacing,
} from "../utilities/density";
import { DesignSystem, DesignSystemResolver } from "../design-system";
import { CheckboxClassNameContract } from "@microsoft/fast-components-class-name-contracts-base";
import {
    add,
    applyFocusVisible,
    directionSwitch,
    divide,
    format,
    toPx,
} from "@microsoft/fast-jss-utilities";
import {
    neutralFillInputActive,
    neutralFillInputHover,
    neutralFillInputRest,
    neutralFocus,
    neutralForegroundRest,
    neutralOutlineActive,
    neutralOutlineHover,
    neutralOutlineRest,
} from "../utilities/color";
import { applyCornerRadius } from "../utilities/border";
import { ComponentStyles } from "@microsoft/fast-jss-manager";
import { applyDisabledState } from "../utilities/disabled";
import { applyScaledTypeRamp } from "../utilities/typography";
import { designUnit, outlineWidth } from "../utilities/design-system";
import { applyCursorDisabled, applyCursorPointer } from "../utilities/cursor";
import { ColorRecipe } from "src/utilities/color/common";
import {
    highContrastBorderColor,
    highContrastDisabledBorder,
    highContrastSelector,
} from "../utilities/high-contrast";

const inputSize: DesignSystemResolver<string> = toPx(
    add(divide(heightNumber(), 2), designUnit)
);
const indeterminateIndicatorMargin: DesignSystemResolver<string> = toPx(
    add(designUnit, densityCategorySwitch(0, 1, 2))
);
const indicatorSvg: (
    color: ColorRecipe<string> | string
) => DesignSystemResolver<string> = (
    color: ColorRecipe<string> | string
): DesignSystemResolver<string> => {
    return (designSystem: DesignSystem): string => {
        const colorEval: string = typeof color === "string" ? color : color(designSystem);
        return `<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill="${encodeURIComponent(
            colorEval
        )}" fill-rule="evenodd" clip-rule="evenodd" d="M8.143 12.6697L15.235 4.5L16.8 5.90363L8.23812 15.7667L3.80005 11.2556L5.27591 9.7555L8.143 12.6697Z"/></svg>`;
    };
};
const styles: ComponentStyles<CheckboxClassNameContract, DesignSystem> = {
    checkbox: {
        position: "relative",
        display: "inline-flex",
        flexDirection: "row",
        alignItems: "center",
        transition: "all 0.2s ease-in-out",
        "& $checkbox_label": {
            paddingLeft: directionSwitch(horizontalSpacing(2), ""),
            paddingRight: directionSwitch("", horizontalSpacing(2)),
        },
    },
    checkbox_input: {
        position: "absolute",
        width: inputSize,
        height: inputSize,
        appearance: "none",
        ...applyCornerRadius(),
        boxSizing: "border-box",
        margin: "0",
        zIndex: "1",
        background: neutralFillInputRest,
        transition: "all 0.2s ease-in-out",
        border: format(
            "{0} solid {1}",
            toPx<DesignSystem>(outlineWidth),
            neutralOutlineRest
        ),
        "&:enabled": {
            ...applyCursorPointer(),
        },
        "&:hover:enabled": {
            background: neutralFillInputHover,
            borderColor: neutralOutlineHover,
        },
        "&:active:enabled": {
            background: neutralFillInputActive,
            borderColor: neutralOutlineActive,
        },
        ...applyFocusVisible({
            boxShadow: format<DesignSystem>("0 0 0 1px {0} inset", neutralFocus),
            borderColor: neutralFocus,
            [highContrastSelector]: {
                boxShadow: format<DesignSystem>("0 0 0 1px ButtonText"),
            },
        }),
        ...highContrastBorderColor,
    },
    checkbox_stateIndicator: {
        position: "relative",
        ...applyCornerRadius(),
        display: "inline-block",
        width: inputSize,
        height: inputSize,
        flexShrink: "0",
        "&::before": {
            content: "''",
            pointerEvents: "none",
            position: "absolute",
            zIndex: "1",
            top: "0",
            left: "0",
            width: inputSize,
            height: inputSize,
        },
    },
    checkbox_label: {
        ...applyCursorPointer(),
        color: neutralForegroundRest,
        ...applyScaledTypeRamp("t7"),
        [highContrastSelector]: {
            color: "ButtonText",
        },
    },
    checkbox__checked: {
        "& $checkbox_stateIndicator": {
            "&::before": {
                background: format(
                    "url('data:image/svg+xml;utf8,{0}')",
                    indicatorSvg(neutralForegroundRest)
                ),
                [highContrastSelector]: {
                    background: format(
                        "url('data:image/svg+xml;utf8,{0}')",
                        indicatorSvg("HighlightText")
                    ),
                },
            },
        },
        "&:hover": {
            "& $checkbox_stateIndicator": {
                "&::before": {
                    [highContrastSelector]: {
                        background: format(
                            "url('data:image/svg+xml;utf8,{0}')",
                            indicatorSvg("Highlight")
                        ),
                    },
                },
            },
        },
        "& $checkbox_input": {
            [highContrastSelector]: {
                background: "Highlight",
            },
            "&:hover": {
                [highContrastSelector]: {
                    background: "HighlightText",
                },
            },
        },
    },
    checkbox__indeterminate: {
        "& $checkbox_stateIndicator": {
            "&::before": {
                ...applyCornerRadius(),
                transform: "none",
                top: indeterminateIndicatorMargin,
                right: indeterminateIndicatorMargin,
                bottom: indeterminateIndicatorMargin,
                left: indeterminateIndicatorMargin,
                width: "auto",
                height: "auto",
                background: neutralForegroundRest,
                [highContrastSelector]: {
                    backgroundColor: "ButtonHighlight",
                },
            },
        },
    },
    checkbox__disabled: {
        ...applyDisabledState(),
        "& $checkbox_input, & $checkbox_label": {
            ...applyCursorDisabled(),
            ...highContrastDisabledBorder,
        },
    },
};

export default styles;
