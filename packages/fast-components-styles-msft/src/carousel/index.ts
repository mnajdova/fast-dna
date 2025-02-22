import { DesignSystem, DesignSystemResolver } from "../design-system";
import { ComponentStyles, CSSRules } from "@microsoft/fast-jss-manager";
import { directionSwitch, format, toPx } from "@microsoft/fast-jss-utilities";
import {
    neutralFillStealthHover,
    neutralFillStealthRest,
    neutralForegroundRest,
    neutralOutlineRest,
} from "../utilities/color";
import { CarouselClassNameContract } from "@microsoft/fast-components-class-name-contracts-msft";
import { designUnit, outlineWidth } from "../utilities/design-system";
import { highContrastSelector } from "../utilities/high-contrast";

const white: string = "#FFF";
const black: string = "#101010";
const darkModeNeutralForegroundRest: DesignSystemResolver<string> = neutralForegroundRest(
    (): string => black
);
const lightModeNeutralForegroundRest: DesignSystemResolver<
    string
> = neutralForegroundRest((): string => white);
const darkModeNeutralFillStealthRest: DesignSystemResolver<
    string
> = neutralFillStealthRest((): string => black);
const lightModeNeutralFillStealthRest: DesignSystemResolver<
    string
> = neutralFillStealthRest((): string => white);

const darkModeNeutralOutlineRest: DesignSystemResolver<string> = neutralOutlineRest(
    (): string => black
);
const lightModeNeutralOutlineRest: DesignSystemResolver<string> = neutralOutlineRest(
    (): string => white
);

function flipperStyles(): CSSRules<{}> {
    return {
        position: "absolute",
        top: "calc(50% - 20px)",
        zIndex: "100",
        display: "block",
        opacity: "0",
        transition: "all 0.2s ease-in-out",
    };
}
const styles: ComponentStyles<CarouselClassNameContract, DesignSystem> = {
    carousel: {
        position: "relative",
        display: "inline-block",
        "&:hover": {
            "& $carousel_flipperPrevious, & $carousel_flipperNext": {
                opacity: "1",
            },
        },
    },
    carousel_slides: {},
    carousel_sequenceIndicators: {
        position: "absolute",
        bottom: "8px",
        display: "block",
        padding: "0",
        textAlign: "center",
        width: "100%",
        zIndex: "100",
        "& > :first-child:nth-last-child(1)": {
            display: "none",
        },
    },
    carousel_sequenceIndicator: {
        display: "inline-block",
        padding: "0 2px",
        "&:focus": {
            outline: "none",
        },
        "&::before": {
            opacity: "0.45",
            border: "1px solid transparent",
            borderRadius: "40px",
            content: "''",
            display: "block",
            height: toPx<DesignSystem>(designUnit),
            width: "32px",
            transition: "all 0.05s ease-in-out",
            [highContrastSelector]: {
                opacity: "1",
                background: "ButtonFace",
                borderColor: "ButtonText",
            },
        },
        "&:not($carousel_sequenceIndicator__active)": {
            "&:hover": {
                "&::before": {
                    opacity: "0.9",
                    [highContrastSelector]: {
                        opacity: "1",
                        background: "Highlight",
                        borderColor: "HighlightText",
                    },
                },
            },
        },
    },
    carousel_sequenceIndicator__active: {
        "&::before": {
            opacity: "1",
            [highContrastSelector]: {
                borderColor: "HighlightText",
            },
        },
    },
    carousel_tabPanel: {
        display: "block",
    },
    carousel_tabPanel__hidden: {
        display: "none",
    },
    carousel_tabPanels: {},
    carousel_tabPanelContent: {},
    carousel_flipperPrevious: {
        ...flipperStyles(),
        left: directionSwitch("6px", ""),
        right: directionSwitch("", "6px"),
    },
    carousel_flipperNext: {
        ...flipperStyles(),
        right: directionSwitch("6px", ""),
        left: directionSwitch("", "6px"),
    },
    carousel__themeDark: {
        "& $carousel_flipperPrevious, & $carousel_flipperNext": {
            "&::before": {
                color: darkModeNeutralForegroundRest,
                fill: darkModeNeutralForegroundRest,
                background: darkModeNeutralFillStealthRest,
                border: format(
                    "{0} solid {1}",
                    toPx<DesignSystem>(outlineWidth),
                    darkModeNeutralOutlineRest
                ),
            },
            "& span::before": {
                borderColor: darkModeNeutralForegroundRest,
            },
            "&:hover": {
                "&::before": {
                    background: neutralFillStealthHover((): string => black),
                    [highContrastSelector]: {
                        background: "Highlight",
                        border: format(
                            "{0} solid HighlightText",
                            toPx<DesignSystem>(outlineWidth)
                        ),
                    },
                },
                "& span::before": {
                    borderColor: darkModeNeutralForegroundRest,
                },
            },
            "& > svg": {
                fill: darkModeNeutralForegroundRest,
                [highContrastSelector]: {
                    fill: "ButtonText",
                },
            },
        },
        "& $carousel_sequenceIndicator": {
            "&::before": {
                background: darkModeNeutralFillStealthRest,
                borderColor: darkModeNeutralOutlineRest,
            },
            "&$carousel_sequenceIndicator__active": {
                "&::before": {
                    background: darkModeNeutralFillStealthRest,
                    [highContrastSelector]: {
                        background: "Highlight",
                    },
                },
            },
        },
    },
    carousel__themeLight: {
        "& $carousel_flipperPrevious, & $carousel_flipperNext": {
            "&::before": {
                color: lightModeNeutralForegroundRest,
                fill: lightModeNeutralForegroundRest,
                background: lightModeNeutralFillStealthRest,
                border: format(
                    "{0} solid {1}",
                    toPx<DesignSystem>(outlineWidth),
                    lightModeNeutralOutlineRest
                ),
            },
            "& span::before": {
                borderColor: lightModeNeutralForegroundRest,
            },
            "&:hover": {
                "&::before": {
                    background: neutralFillStealthHover((): string => white),
                    [highContrastSelector]: {
                        background: "Highlight",
                        border: format(
                            "{0} solid HighlightText",
                            toPx<DesignSystem>(outlineWidth)
                        ),
                    },
                },
                "& span::before": {
                    borderColor: lightModeNeutralForegroundRest,
                },
            },
            "& > svg": {
                fill: lightModeNeutralForegroundRest,
                [highContrastSelector]: {
                    fill: "ButtonText",
                },
            },
        },
        "& $carousel_sequenceIndicator": {
            "&::before": {
                background: lightModeNeutralFillStealthRest,
                borderColor: lightModeNeutralOutlineRest,
            },
            "&$carousel_sequenceIndicator__active": {
                "&::before": {
                    background: lightModeNeutralFillStealthRest,
                    [highContrastSelector]: {
                        background: "Highlight",
                    },
                },
            },
        },
    },
    carousel__slideAnimatePrevious: {},
    carousel__slideAnimateNext: {},
};

export default styles;
