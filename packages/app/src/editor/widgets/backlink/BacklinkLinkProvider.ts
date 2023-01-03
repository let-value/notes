import { CancellationToken, editor, languages } from "monaco-editor";

export class BacklinkLinkProvider implements languages.LinkProvider {
    provideLinks(model: editor.ITextModel, token: CancellationToken): languages.ProviderResult<languages.ILinksList> {
        throw new Error("Method not implemented.");
    }
    resolveLink?:
        | ((link: languages.ILink, token: CancellationToken) => languages.ProviderResult<languages.ILink>)
        | undefined;
}

languages.registerLinkProvider("markdown", new BacklinkLinkProvider());
