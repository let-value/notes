import { DocumentNode } from "../DocumentNode";
import { SheetNode } from "./SheetNode";

export class CsvNode extends DocumentNode {
    render() {
        return <SheetNode />;
    }
}
