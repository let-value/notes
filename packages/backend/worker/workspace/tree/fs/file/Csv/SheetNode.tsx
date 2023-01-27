import { ReactiveComponentProperty } from "app/src/utils";
import { distinctUntilChanged, map, mergeMap } from "rxjs";
import { DocumentNode } from "../DocumentNode";

interface SheetNodeProps {
    link: string;
}

export class SheetNode extends DocumentNode<SheetNodeProps> {
    link$ = new ReactiveComponentProperty(this, (props$) =>
        props$.pipe(
            map(() => this.context.parent.props.item),
            mergeMap((item) => this.context.root.registryRef.current.getLink(item)),
        ),
    );

    metadata$ = new ReactiveComponentProperty(this, (props$) =>
        props$.pipe(
            mergeMap(() => {
                const metadata = this.context.root.metadataRef.current;
                const database = metadata.databaseRef.current;
                return database.getFile(this.props.link);
            }),
        ),
    );

    sheet$ = new ReactiveComponentProperty(this, (props$) =>
        props$.pipe(
            mergeMap(() => this.link$.pipeline$),
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
