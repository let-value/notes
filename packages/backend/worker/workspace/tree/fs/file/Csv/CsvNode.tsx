import { DocumentNode } from "../DocumentNode";
import { FileLinkNode } from "../FileLinkNode";
import { SheetNode } from "./SheetNode";

export class CsvNode extends DocumentNode {
    render() {
        return <FileLinkNode>{({ link }) => <SheetNode link={link} />}</FileLinkNode>;
    }
}
