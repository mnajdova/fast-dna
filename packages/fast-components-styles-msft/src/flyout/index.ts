import { ComponentStyles } from "@microsoft/fast-jss-manager";
import { FlyoutClassNameContract } from "@microsoft/fast-components-class-name-contracts-msft";
import { DesignSystem, ensureDesignSystemDefaults } from "../design-system";
import { applyFloatingCornerRadius } from "../utilities/border";
import { applyElevation, ElevationMultiplier } from "../utilities/elevation";

const styles: ComponentStyles<FlyoutClassNameContract, DesignSystem> = {
    flyout_positioner: {
        display: "none",
        zIndex: "1",
        '&[aria-hidden="false"]': {
            display: "block",
        },
    },
    flyout_visual: {
        background: ensureDesignSystemDefaults(
            (designSystem: DesignSystem): string => designSystem.backgroundColor
        ),
        height: "100%",
        width: "100%",
        ...applyFloatingCornerRadius(),
        ...applyElevation(ElevationMultiplier.e14),
    },
    flyout__top: {},
    flyout__bottom: {},
    flyout__left: {},
    flyout__right: {},
    flyout__horizontalInset: {},
    flyout__verticalInset: {},
};

export default styles;
