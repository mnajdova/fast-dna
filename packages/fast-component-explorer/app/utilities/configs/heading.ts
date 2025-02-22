import { ComponentViewConfig } from "./data.props";
import {
    Heading,
    HeadingProps,
    headingSchema,
    HeadingSize,
    HeadingTag,
} from "@microsoft/fast-components-react-msft";
import Guidance from "../../.tmp/heading/guidance";

const headingConfig: ComponentViewConfig<HeadingProps> = {
    schema: headingSchema,
    component: Heading,
    guidance: Guidance,
    scenarios: [
        {
            displayName: "Heading 1",
            data: {
                tag: HeadingTag.h1,
                size: HeadingSize._1,
                children: "Heading 1",
            },
        },
        {
            displayName: "Heading 2",
            data: {
                tag: HeadingTag.h2,
                size: HeadingSize._2,
                children: "Heading 2",
            },
        },
        {
            displayName: "Heading 3",
            data: {
                tag: HeadingTag.h3,
                size: HeadingSize._3,
                children: "Heading 3",
            },
        },
        {
            displayName: "Heading 4",
            data: {
                tag: HeadingTag.h4,
                size: HeadingSize._4,
                children: "Heading 4",
            },
        },
        {
            displayName: "Heading 5",
            data: {
                tag: HeadingTag.h5,
                size: HeadingSize._5,
                children: "Heading 5",
            },
        },
        {
            displayName: "Heading 6",
            data: {
                tag: HeadingTag.h6,
                size: HeadingSize._6,
                children: "Heading 6",
            },
        },
    ],
};

export default headingConfig;
