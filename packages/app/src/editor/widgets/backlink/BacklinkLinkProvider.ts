import { container } from "@/container";
import { CancellationToken, editor, languages } from "monaco-editor";

const modelToEditor = container.get("modelToEditor");
const tokensService = container.get("tokensService");

export class BacklinkLinkProvider implements languages.LinkProvider {
    provideLinks(model: editor.ITextModel): languages.ProviderResult<languages.ILinksList> {
        const editor = modelToEditor.getEditor(model);
        if (!editor) {
            return null;
        }

        const tokens = tokensService.getModelTokens(editor, model);
        return null;
    }
    resolveLink?:
        | ((link: languages.ILink, token: CancellationToken) => languages.ProviderResult<languages.ILink>)
        | undefined;
}
