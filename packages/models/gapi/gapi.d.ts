/// <reference types="@types/gapi" />

declare namespace gapi {
    namespace errors {
        export interface DetailedError {
            message: string;
            domain: string;
            reason: string;
            extendedHelp: string;
        }

        export interface Link {
            description: string;
            url: string;
        }

        export interface Metadata {
            service: string;
            consumer: string;
        }

        export interface Detail {
            "@type": string;
            links: Link[];
            reason: string;
            domain: string;
            metadata: Metadata;
        }

        export interface Error {
            code: number;
            message: string;
            errors: DetailedError[];
            status: string;
            details: Detail[];
        }

        export interface ErrorResponse {
            error: Error;
        }
    }
}

export = gapi;
export as namespace gapi;
