export const linkName = "wikilink";

// eslint-disable-next-line no-useless-escape
export const linkRegex = /(\!)?\[\[+([^\]\|]+)(?:\|)?([^\]]+)?\]\]/;

export function parseLink(link: string) {
    const match = link.match(linkRegex);
    const embed = !!match?.[1];
    const path = match?.[2];
    const title = match?.[3];

    return {
        embed,
        path,
        title,
    };
}
