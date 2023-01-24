import { BacklinksNode } from "../../../BacklinksNode";
import { DocumentNode } from "../DocumentNode";
import { FileContentNode } from "../FileContentNode";
import { FileLinkNode } from "../FileLinkNode";
import { SheetNode } from "./SheetNode";

export class CsvNode extends DocumentNode {
    render() {
        return (
            <>
                <FileLinkNode>
                    {({ link }) => (
                        <FileContentNode>
                            {({ content }) => <SheetNode link={link} content={content} />}
                        </FileContentNode>
                    )}
                </FileLinkNode>
                <BacklinksNode />
            </>
        );
    }
}
