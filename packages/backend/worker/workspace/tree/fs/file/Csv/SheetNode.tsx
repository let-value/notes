import { schema } from "app/src/editor/schemas/database.schema";
import { ReactiveState } from "app/src/utils";
import { ColumnOption, Info, Options as ParseOptions, parse } from "csv-parse/browser/esm";
import { Options as StringifyOptions, stringify } from "csv-stringify/browser/esm";
import { ExportedChange, RawCellContent } from "hyperformula";
import { FromSchema } from "json-schema-to-ts";
import { catchError, combineLatest, filter, fromEventPattern, map, of, skipWhile, switchMap, tap } from "rxjs";
import { FileNode } from "../../FileNode";
import { DocumentNode } from "../DocumentNode";
type DatabaseMeta = FromSchema<typeof schema>;

type Item = {
    record: RawCellContent[] | Record<string, RawCellContent>;
    info: Info;
};

type ResultInfo = Info & {
    columns?: ColumnOption[];
};

const defaultMeta: DatabaseMeta = {
    header: false,
};

interface SheetNodeProps {
    sheetId: number;
    metadata: FileNode;
}

export class SheetNode extends DocumentNode<SheetNodeProps> {
    private skipMetaReadFlag = false;
    private skipMetaSaveFlag = true;
    private skipContentReadFlag = false;
    private skipContentSaveFlag = true;
    meta$ = new ReactiveState<DatabaseMeta>();

    private saveMetaSubscription = this.meta$
        .pipe(
            skipWhile((meta) => {
                if (meta === undefined) {
                    return true;
                }
                if (this.skipMetaSaveFlag) {
                    this.skipMetaSaveFlag = false;
                    return true;
                }
                return false;
            }),
        )
        .subscribe((meta) => {
            this.props.metadata.writeFile(JSON.stringify(meta, null, 4));
        });

    private readMetaSubscription = this.props.metadata.content$
        .pipe(
            skipWhile(() => {
                if (this.skipMetaReadFlag) {
                    this.skipMetaReadFlag = false;
                    return true;
                }
                return false;
            }),
            map((content) => JSON.parse(content) as DatabaseMeta),
            catchError(() => of(defaultMeta)),
        )
        .subscribe((meta) => {
            this.skipMetaReadFlag = true;
            this.meta$.next(meta);
        });

    private updateSheet = combineLatest([this.meta$.pipe(filter((x) => x !== undefined)), this.context.parent.content$])
        .pipe(
            tap((x) => console.log(this, "updateSheet", x)),
            switchMap(async ([meta, content]) => {
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
                                typeof column === "object"
                                    ? column.name
                                    : typeof column === "string"
                                    ? column
                                    : undefined;

                            if (accessor === undefined) {
                                return undefined;
                            }

                            return record[accessor];
                        });
                    }

                    return record as RawCellContent[];
                });
            }),
        )
        .subscribe((result) => {
            console.log("updateSheet", result);
            const instance = this.context.root.hyperFormulaRef.current.instance;
            instance.setSheetContent(this.props.sheetId, result);
        });

    sheet$ = fromEventPattern(
        (handler) => {
            this.context.root.hyperFormulaRef.current.instance.on("valuesUpdated", handler);
        },
        (handler) => {
            this.context.root.hyperFormulaRef.current.instance.off("valuesUpdated", handler);
        },
    ).pipe(
        filter((changes: ExportedChange[]) => {
            const firstChange = changes?.[0];
            return firstChange && "address" in firstChange && firstChange.address.sheet === this.props.sheetId;
        }),
        map(() => {
            const instance = this.context.root.hyperFormulaRef.current.instance;
            return instance.getSheetSerialized(this.props.sheetId);
        }),
    );

    private saveSheet = combineLatest([
        this.meta$.pipe(filter((x) => x !== undefined)),
        this.sheet$.pipe(
            skipWhile(() => {
                if (this.skipContentSaveFlag) {
                    this.skipContentSaveFlag = false;
                    return true;
                }
                return false;
            }),
        ),
    ]).subscribe(async ([meta, content]) => {
        const output = await new Promise<string>((resolve, reject) => {
            const options: StringifyOptions = meta.header
                ? { header: true, columns: meta.columns.map((column) => column.name) }
                : { header: false };

            stringify(content, { ...options, quoted: true, quoted_empty: true, quoted_string: true }, (err, output) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(output);
                }
            });
        });

        console.log("writeFile", output);
        //await this.context.parent.writeFile(output)
    });

    componentWillUnmount() {
        super.componentWillUnmount();
        this.saveMetaSubscription.unsubscribe();
        this.readMetaSubscription.unsubscribe();
        this.updateSheet.unsubscribe();
        this.saveSheet.unsubscribe();
    }

    render() {
        return null;
    }
}
