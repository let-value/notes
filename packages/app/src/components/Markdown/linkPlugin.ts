import { linkName, linkRegex, linkSegments } from "@/editor/tokens/link";
import { Parent, Resource, Root, StaticPhrasingContent } from "mdast";
import { visit } from "unist-util-visit";

const extractPosition = (string: string, start: number, end: number) => {
    const startLine = string.slice(0, start).split("\n");
    const endLine = string.slice(0, end).split("\n");

    return {
        start: {
            line: startLine.length,
            column: startLine[startLine.length - 1].length + 1,
        },
        end: {
            line: endLine.length,
            column: endLine[endLine.length - 1].length + 1,
        },
    };
};

const extractText = (string: string, start: number, end: number): StaticPhrasingContent => ({
    type: "text",
    value: string.slice(start, end),
    position: extractPosition(string, start, end),
});

export interface LinkContent extends Parent, Resource {
    type: typeof linkName;
    children: StaticPhrasingContent[];
}

const globalLinkRegex = new RegExp(linkRegex, "g");

export const linkPlugin = () => {
    function transformer(tree: Root) {
        console.log(tree);
        visit(tree, "text", (node, position, parent) => {
            if (position == null || parent == null) {
                return;
            }

            const definition: (StaticPhrasingContent | LinkContent)[] = [];
            let lastIndex = 0;

            const matches = node.value.matchAll(globalLinkRegex);

            for (const match of matches) {
                if (match.index === undefined) {
                    continue;
                }
                const { embed, path, title } = linkSegments(match);
                const value = match[0];

                if (match.index !== lastIndex) {
                    definition.push(extractText(node.value, lastIndex, match.index));
                }

                definition.push({
                    type: linkName,
                    url: path ?? "",
                    data: {
                        embed,
                    },
                    title,
                    children: [
                        extractText(
                            node.value,
                            match.index + 1, // 1 is start ~
                            match.index + value.length + 1, // 1 is start ~
                        ),
                    ],
                    position: extractPosition(
                        node.value,
                        match.index,
                        match.index + value.length + 2, // 2 is start and end ~
                    ),
                });

                lastIndex = match.index + value.length + 2; // 2 is start and end ~
            }

            if (lastIndex !== node.value.length) {
                const text = extractText(node.value, lastIndex, node.value.length);
                definition.push(text);
            }

            const last = parent.children.slice(position + 1);
            parent.children = parent.children.slice(0, position);
            parent.children = parent.children.concat(definition as never);
            parent.children = parent.children.concat(last);
        });
    }

    return transformer;
};
