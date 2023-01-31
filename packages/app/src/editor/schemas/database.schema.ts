export const columnTypes = ["string", "number", "boolean", "date", "formula", "select", "created", "updated"] as const;
export type ColumnType = (typeof columnTypes)[number];

export const viewTypes = ["table", "board", "timeline", "calendar", "list", "gallery"] as const;

export const schema = {
    $id: "http://example.com/schemas/database.json",
    type: "object",
    required: ["header"],
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
                        enum: columnTypes,
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
        views: {
            type: "array",
            items: {
                type: "object",
                required: ["name", "type"],
                properties: {
                    name: {
                        type: "string",
                    },
                    type: {
                        enum: viewTypes,
                    },
                },
                additionalProperties: false,
            },
        },
    },
    allOf: [
        {
            if: {
                properties: {
                    header: {
                        const: true,
                    },
                },
            },
            then: {
                required: ["columns"],
            },
        },
    ],
    dependentRequired: {
        views: ["columns"],
    },
    additionalProperties: false,
} as const;
