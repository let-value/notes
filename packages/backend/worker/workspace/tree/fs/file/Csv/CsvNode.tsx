import { ReactiveComponentProperty } from "app/src/utils";
import { distinctUntilChanged, map, switchMap } from "rxjs";
import { DocumentNode } from "../DocumentNode";
import { SheetNode } from "./SheetNode";

export class CsvNode extends DocumentNode {
    metadata$ = new ReactiveComponentProperty(this, (props$) =>
        props$.pipe(
            switchMap(() => this.context.parent.link$),
            distinctUntilChanged(),
            switchMap((link) => {
                const metadata = this.context.root.metadataRef.current;
                const database = metadata.databaseRef.current;
                return database.getFile(link);
            }),
        ),
    );

    sheet$ = new ReactiveComponentProperty(this, (props$) =>
        props$.pipe(
            switchMap(() => this.context.parent.link$),
            distinctUntilChanged(),
            map((link) => {
                const instance = this.context.root.hyperFormulaRef.current.instance;
                instance.addSheet(link);
                return instance.getSheetId(link);
            }),
        ),
    );

    render() {
        if (this.metadata$.value === undefined || this.sheet$.value === undefined) {
            return null;
        }

        return <SheetNode sheetId={this.sheet$.value} metadata={this.metadata$.value} />;
    }
}
