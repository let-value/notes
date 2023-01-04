import { ItemHandle, Token } from "models";

export interface FileComponentProps extends ItemHandle<false> {
    language: string;
}

export interface FilePropsWithTokens extends FileComponentProps {
    tokens: Token[];
}
