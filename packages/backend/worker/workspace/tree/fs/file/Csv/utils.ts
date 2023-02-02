import { databaseSchema } from "app/src/editor/schemas/database.schema";
import { ColumnOption, Info, Options as ParseOptions, parse } from "csv-parse/browser/esm";
import { Options as StringifyOptions, stringify } from "csv-stringify/browser/esm";
import { RawCellContent } from "hyperformula";
import { FromSchema } from "json-schema-to-ts";

export type DatabaseMeta = FromSchema<typeof databaseSchema>;

export type DatabaseView = DatabaseMeta["views"][number];

type Item = {
    record: RawCellContent[] | Record<string, RawCellContent>;
    info: Info;
};

type ResultInfo = Info & {
    columns?: ColumnOption[];
};

export async function parseDatabase(meta: DatabaseMeta, content: string): Promise<RawCellContent[][]> {
    const options: ParseOptions = meta.header
        ? { columns: meta.columns.map((column) => column.name), from_line: 2 }
        : { columns: false };

    const { items, info } = await new Promise<{ items: Item[]; info: ResultInfo }>((resolve, reject) => {
        parse(content, { ...options, cast: true, cast_date: true, info: true }, (err, items, info) => {
            if (err) {
                reject(err);
            } else {
                resolve({ items, info });
            }
        });
    });

    return items.map(({ record }) => {
        if (info.columns) {
            return info.columns.map((column) => {
                const accessor =
                    typeof column === "object" ? column.name : typeof column === "string" ? column : undefined;

                if (accessor === undefined) {
                    return undefined;
                }

                return record[accessor];
            });
        }

        return record as RawCellContent[];
    });
}

export function stringifyDatabase(meta: DatabaseMeta, items: RawCellContent[][]) {
    const options: StringifyOptions = meta.header
        ? { header: true, columns: meta.columns.map((column) => column.name) }
        : { header: false };

    return new Promise<string>((resolve, reject) => {
        stringify(items, { ...options, quoted: true, quoted_empty: true, quoted_string: true }, (err, output) => {
            if (err) {
                reject(err);
            } else {
                resolve(output);
            }
        });
    });
}
