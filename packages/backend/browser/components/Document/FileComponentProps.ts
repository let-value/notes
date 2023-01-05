import { Item, Token } from "models";

export interface FileComponentProps extends Item<false> {
    language: string;
}

export interface FilePropsWithTokens extends FileComponentProps {
    tokens: Token[];
}
