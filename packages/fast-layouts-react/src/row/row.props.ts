import React from "react";
import { RowClassNamesContract } from "./row";
import { ManagedClasses } from "@microsoft/fast-jss-manager-react";

/**
 * Defines the possible props for the Row component
 * @interface
 */

/**
 * The resize direction options: 'north' | 'south'
 */
export enum RowResizeDirection {
    north = "north",
    south = "south",
}

export interface RowManagedClasses extends ManagedClasses<RowClassNamesContract> {}
export interface RowUnhandledProps extends React.HTMLAttributes<HTMLDivElement> {}
export interface RowHandledProps extends RowManagedClasses {
    /**
     * The initial height of the row
     */
    initialHeight?: number;

    /**
     * The height of a row when it is collapsed
     */
    collapsedHeight?: number;

    /**
     * Causes the row to fill all available vertical space
     */
    fill?: boolean;

    /**
     * The minimum height of the row
     */
    minHeight?: number;

    /**
     * The maximum height of the row
     */
    maxHeight?: number;

    /**
     * The height of the row
     */
    height?: number;

    /**
     * Flag for if the column should be resizable
     */
    resizable?: boolean;

    /**
     * The id of the row.
     */
    id?: string;

    /**
     * The collapsed state of the Row
     */
    collapsed?: boolean;

    /**
     * Determines if this row is overlaid
     */
    overlay?: boolean;

    /**
     * Set whether the row should be hidden or not
     */
    hidden?: boolean;

    /**
     * Direction that the row should be resized from
     */
    resizeFrom?: RowResizeDirection;

    /**
     * The callback which is fired during resize
     */
    onResize?: (
        e: MouseEvent | React.KeyboardEvent<HTMLButtonElement>,
        height?: number
    ) => void;
}

export type RowProps = RowHandledProps & RowUnhandledProps;
