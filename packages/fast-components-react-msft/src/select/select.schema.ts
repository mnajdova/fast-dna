export default {
    $schema: "http://json-schema.org/schema#",
    title: "Select",
    description: "A select component's schema definition.",
    type: "object",
    id: "@microsoft/fast-components-react-msft/select",
    formPluginId: "@microsoft/fast-components-react-msft/select",
    properties: {
        placeholder: {
            title: "Placeholder",
            type: "string",
        },
        name: {
            title: "Name",
            type: "string",
        },
        form: {
            title: "Form Id",
            type: "string",
        },
        disabled: {
            title: "Disabled",
            type: "boolean",
        },
        isMenuOpen: {
            title: "Is menu open",
            type: "boolean",
        },
        required: {
            title: "Required",
            type: "boolean",
        },
        multiselectable: {
            title: "Multiselectable",
            type: "boolean",
        },
        selectedItems: {
            title: "Selected items",
            type: "string",
        },
        defaultSelection: {
            title: "Default selection",
            type: "string",
        },
        autoFocus: {
            title: "Auto focus",
            type: "boolean",
        },
        labelledBy: {
            title: "Labelled by",
            type: "string",
        },
    },
    reactProperties: {
        children: {
            title: "Building blocks",
            type: "children",
            formPluginId: "@microsoft/fast-components-react-msft/select/children",
            ids: ["@microsoft/fast-components-react-msft/select-option"],
        },
    },
};
