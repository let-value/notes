import { ReactiveState } from "app/src/utils";
import { ExportedChange } from "hyperformula";
import {
    catchError,
    combineLatest,
    filter,
    fromEventPattern,
    map,
    of,
    skipWhile,
    switchMap,
    withLatestFrom,
} from "rxjs";
import { TreeContextProps } from "../../../TreeNode";
import { FileNode } from "../../FileNode";
import { DocumentNode } from "../DocumentNode";
import { DatabaseMeta, parseDatabase, stringifyDatabase } from "./utils";

const defaultMeta: DatabaseMeta = {
    header: false,
    views: [
        {
            name: "Table",
            type: "table",
        },
    ],
};

interface SheetNodeProps {
    sheetId: number;
    metadata: FileNode;
}

export class SheetNode extends DocumentNode<SheetNodeProps> {
    private skipMetaReadFlag = false;
    private skipMetaSaveFlag = true;
    private skipContentReadFlag = false;
    private skipContentSaveFlag = false;
    meta$ = new ReactiveState<DatabaseMeta>();
    metaPipe$ = this.meta$.pipe(filter((x) => x !== undefined));

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
            this.skipMetaReadFlag = true;
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

    private updateSheetByContent = this.context.parent.content$
        .pipe(
            skipWhile(() => {
                if (this.skipContentReadFlag) {
                    this.skipContentReadFlag = false;
                    return true;
                }
                return false;
            }),
            withLatestFrom(this.metaPipe$),
            switchMap(([content, meta]) => {
                return parseDatabase(meta, content);
            }),
        )
        .subscribe((result) => {
            console.log("updateSheet", result);
            this.skipContentSaveFlag = true;
            const instance = this.context.root.hyperFormulaRef.current.instance;
            instance.setSheetContent(this.props.sheetId, result);
        });

    private updateSheetByMeta = this.meta$
        .pipe(
            withLatestFrom(this.context.parent.content$),
            switchMap(([meta, content]) => {
                return parseDatabase(meta, content);
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
    );

    serialized$ = this.sheet$.pipe(
        map(() => {
            const instance = this.context.root.hyperFormulaRef.current.instance;
            return instance.getSheetSerialized(this.props.sheetId);
        }),
    );

    computed$ = this.sheet$
        .pipe(
            map(() => {
                const instance = this.context.root.hyperFormulaRef.current.instance;
                return instance.getSheetValues(this.props.sheetId);
            }),
        )
        .subscribe((result) => {
            console.log("computed", result);
        });

    private saveSheet = combineLatest([
        this.metaPipe$,
        this.serialized$.pipe(
            skipWhile(() => {
                if (this.skipContentSaveFlag) {
                    this.skipContentSaveFlag = false;
                    return true;
                }
                return false;
            }),
        ),
    ]).subscribe(async ([meta, content]) => {
        const output = await stringifyDatabase(meta, content);

        this.skipContentReadFlag = true;
        console.log("writeFile", output);

        //await this.context.parent.writeFile(output)
    });

    componentDidMount() {
        super.componentDidMount();
        this.context.root.hyperFormulaRef.current?.addChildren(this);
    }

    componentWillUnmount() {
        super.componentWillUnmount();
        this.context.root.hyperFormulaRef.current?.removeChildren(this);
        this.saveMetaSubscription.unsubscribe();
        this.readMetaSubscription.unsubscribe();
        this.updateSheetByContent.unsubscribe();
        this.updateSheetByMeta.unsubscribe();
        this.saveSheet.unsubscribe();
    }

    newContext: TreeContextProps = { ...this.context, parent: this };

    render() {
        return null;
    }
}
