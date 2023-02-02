declare module "lang-map" {
    export function languages(extension: string): string[];
    export function extensions(language: string): string[];
}
