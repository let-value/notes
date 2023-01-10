import { container } from "@/container";
import { CancellationToken, editor, languages } from "monaco-editor";
import { firstValueFrom } from "rxjs";

const modelToEditor = container.get("modelToEditor");
const tokensService = container.get("tokensService");

export class BacklinkLinkProvider implements languages.LinkProvider {
    provideLinks = async function (model: editor.ITextModel): Promise<languages.ILinksList | null> {
        const editor = modelToEditor.getEditor(model).value;
        if (!editor) {
            return null;
        }

        const tokens = await firstValueFrom(tokensService.getEditorCompensatedTokens(editor));
        console.log(tokens);

        const links = tokens
            .filter((token) => token.type.includes("wikilink"))
            .map(
                (token): languages.ILink => ({
                    range: {
                        startLineNumber: token.line + 1,
                        startColumn: token.start + 1,
                        endLineNumber: token.line + 1,
                        endColumn: token.end + 1,
                    },
                    url: token.value,
                    tooltip: "Link",
                }),
            );

        return { links };
    };
    resolveLink?:
        | ((link: languages.ILink, token: CancellationToken) => languages.ProviderResult<languages.ILink>)
        | undefined;
}
