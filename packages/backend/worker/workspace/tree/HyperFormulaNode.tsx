import HyperFormula from "hyperformula";
import { createPropPlugin } from "../../hyperFormula";
import { TreeNode } from "./TreeNode";

export class HyperFormulaNode extends TreeNode {
    instance = HyperFormula.buildEmpty({
        licenseKey: "gpl-v3",
        functionPlugins: [createPropPlugin(this)],
    });

    render() {
        return null;
    }
}
