export default {
    $schema: "http://json-schema.org/schema#",
    title: "Radio",
    description: "A radio component's schema definition",
    type: "object",
    id: "@microsoft/fast-components-react-msft/radio",
    formPluginId: "@microsoft/fast-components-react-msft/radio",
    properties: {
        inputId: {
            title: "Unique Id",
            type: "string",
            examples: ["radio01"],
        },
        checked: {
            title: "Checked",
            type: "boolean",
        },
        disabled: {
            title: "Disabled",
            type: "boolean",
        },
        name: {
            title: "Name",
            type: "string",
            examples: ["name"],
        },
    },
    reactProperties: {
        children: {
            title: "Children",
            type: "children",
            formPluginId: "@microsoft/fast-components-react-msft/radio/children",
            defaults: ["text"],
        },
    },
    required: ["inputId"],
};
