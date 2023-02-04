import { createReplaySubject, ReactiveComponentProperty } from "app/src/utils";
import { distinctUntilChanged, filter, firstValueFrom, map, switchMap } from "rxjs";
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

    sheetReady$ = createReplaySubject(
        this.context.parent.children$.pipe(
            map((children) => children.some((child) => child.constructor === SheetNode)),
        ),
        1,
    );
    get sheetReady() {
        return firstValueFrom(this.sheetReady$.pipe(filter((ready) => ready)));
    }

    componentWillUnmount() {
        super.componentWillUnmount();
        const instance = this.context.root.hyperFormulaRef.current.instance;
        instance.removeSheet(this.sheet$.value);
    }

    render() {
        if (this.metadata$.value === undefined || this.sheet$.value === undefined) {
            return null;
        }

        return <SheetNode sheetId={this.sheet$.value} metadata={this.metadata$.value} />;
    }
}
