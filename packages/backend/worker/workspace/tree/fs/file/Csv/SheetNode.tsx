import { ReactiveComponentProperty } from "app/src/utils";
import { distinctUntilChanged, map, switchMap } from "rxjs";
import { DocumentNode } from "../DocumentNode";

export class SheetNode extends DocumentNode {
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

    // content = this.sheet$.pipeline$.pipe(take(1)).subscribe(async (sheetId) => {
    //     const instance = this.context.root.hyperFormulaRef.current.instance;
    //     const { data } = Papa.parse(this.props.content);
    //     instance.setSheetContent(sheetId, data);
    // });

    render() {
        return null;
    }
}
