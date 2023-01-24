import { ReactiveComponentProperty } from "app/src/utils";
import Papa from "papaparse";
import { distinctUntilChanged, map, take } from "rxjs";
import { DocumentNode } from "../DocumentNode";

interface SheetNodeProps {
    link: string;
    content: string;
}

export class SheetNode extends DocumentNode<SheetNodeProps> {
    sheet$ = new ReactiveComponentProperty(this, (props$) =>
        props$.pipe(
            map((props) => props.link),
            distinctUntilChanged(),
            map((link) => {
                const instance = this.context.root.hyperFormula.current.instance;
                instance.addSheet(link);
                return instance.getSheetId(link);
            }),
        ),
    );

    content = this.sheet$.pipeline$.pipe(take(1)).subscribe(async (sheetId) => {
        const instance = this.context.root.hyperFormula.current.instance;
        const { data } = Papa.parse(this.props.content);
        instance.setSheetContent(sheetId, data);
    });

    render() {
        if (this.sheet$.value === undefined) {
            return null;
        }

        // const values = this.context.root.hyperFormula.current.instance.getSheetValues(this.sheet$.value);
        // console.log(values);

        return null;
    }
}
