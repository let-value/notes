import HyperFormula, { FunctionArgumentType, FunctionPlugin } from "hyperformula";
import * as languages from "hyperformula/es/i18n/languages";
import { InterpreterState } from "hyperformula/typings/interpreter/InterpreterState";
import { ProcedureAst } from "hyperformula/typings/parser";
import type { HyperFormulaNode } from "../workspace/tree/database/HyperFormulaNode";

export const PropFunction = "PROP";

export function createPropPlugin(node: HyperFormulaNode) {
    return class PropPlugin extends FunctionPlugin {
        public [PropFunction](ast: ProcedureAst, state: InterpreterState) {
            return this.runFunction(ast.args, state, this.metadata(PropFunction), (property) => {
                console.log(this, node, ast, state, property);
                return `👋 Hello, ${property}!`;
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
