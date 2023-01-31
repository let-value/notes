import HyperFormula from "hyperformula";
import { BehaviorSubject, map } from "rxjs";
import { createPropPlugin } from "../../../hyperFormula";
import { SheetNode } from "../fs/file/Csv/SheetNode";
import { TreeNode } from "../TreeNode";

export class HyperFormulaNode extends TreeNode {
    declare children$: BehaviorSubject<SheetNode[]>;
    declare addChildren: (node: SheetNode) => void;
    declare removeChildren: (node: SheetNode) => void;

    deepReady$ = new BehaviorSubject(true);
    progress$ = new BehaviorSubject([0, 0] as [number, number]);

    instance = HyperFormula.buildEmpty({
        licenseKey: "gpl-v3",
        functionPlugins: [createPropPlugin(this)],
    });

    sheets$ = new BehaviorSubject<Record<number, SheetNode>>({});

    private sheetsRepository = this.children$
        .pipe(
            map((sheets) => sheets.map((sheet) => [sheet.props.sheetId, sheet] as [number, SheetNode])),
            map((sheets) => Object.fromEntries(sheets)),
        )
        .subscribe(this.sheets$);

    render() {
        return null;
    }
}
