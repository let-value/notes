export const schema = {
    $id: "http://example.com/schemas/database.json",
    type: "object",
    required: ["header", "columns"],
    properties: {
        header: {
            type: "boolean",
        },
        columns: {
            type: "array",
            items: {
                type: "object",
                required: ["name", "type"],
                properties: {
                    name: {
                        type: "string",
                    },
                    type: {
                        enum: ["string", "number", "boolean", "date", "formula", "select", "created", "updated"],
                    },
                    format: {
                        type: "string",
                    },
                    formula: {
                        type: "string",
                    },
                    options: {
                        type: "array",
                        items: {
                            type: "string",
                        },
                    },
                },
                additionalProperties: false,
                allOf: [
                    {
                        if: {
                            properties: {
                                type: {
                                    const: "formula",
                                },
                            },
                        },
                        then: {
                            required: ["formula"],
                        },
                    },
                    {
                        if: {
                            properties: {
                                type: {
                                    const: "select",
                                },
                            },
                        },
                        then: {
                            required: ["options"],
                        },
                    },
                ],
            },
        },
    },
    additionalProperties: false,
} as const;
