import { container } from "@/container";
import { CancellationToken, editor, languages } from "monaco-editor";

const tokensService = container.get("tokensService");

export class BacklinkLinkProvider implements languages.LinkProvider {
    provideLinks(model: editor.ITextModel): languages.ProviderResult<languages.ILinksList> {
        const tokens = tokensService.getModelTokens(model);
        throw new Error("Method not implemented.");
    }
    resolveLink?:
        | ((link: languages.ILink, token: CancellationToken) => languages.ProviderResult<languages.ILink>)
        | undefined;
}
