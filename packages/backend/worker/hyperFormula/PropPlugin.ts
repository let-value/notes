import HyperFormula, {
    CellError,
    DetailedCellError,
    ErrorType,
    FunctionArgumentType,
    FunctionPlugin,
} from "hyperformula";
import * as languages from "hyperformula/es/i18n/languages";
import { InterpreterState } from "hyperformula/typings/interpreter/InterpreterState";
import { ProcedureAst } from "hyperformula/typings/parser";
import type { HyperFormulaNode } from "../workspace/tree/database/HyperFormulaNode";

export const PropFunction = "PROP";

export function createPropPlugin(node: HyperFormulaNode) {
    return class PropPlugin extends FunctionPlugin {
        public [PropFunction](ast: ProcedureAst, state: InterpreterState) {
            return this.runFunction(ast.args, state, this.metadata(PropFunction), (property) => {
                const { sheet, row, col: formulaCol } = state.formulaAddress;

                const sheetNode = node.sheets$.getValue()?.[sheet];
                const meta = sheetNode.meta$.getValue();

                if (!sheetNode || !meta?.columns) {
                    return new CellError(ErrorType.ERROR, "Sheet not found");
                }

                const col = meta.columns.findIndex((column) => column.name === property);

                if (col === formulaCol) {
                    return new CellError(ErrorType.CYCLE, "Cannot reference itself");
                }

                const value = node.instance.getCellValue({ sheet, col, row });

                if (value instanceof DetailedCellError) {
                    return new CellError(ErrorType.REF, value.message);
                }

                return value;
            });
        }
        public static implementedFunctions = {
            [PropFunction]: {
                method: PropFunction,
                parameters: [{ argumentType: FunctionArgumentType.STRING }],
            },
        };
    };
}

for (const language of Object.keys(languages)) {
    try {
        HyperFormula.getLanguage(language).extendFunctions({ [PropFunction]: PropFunction });
    } catch {
        //
    }
}
