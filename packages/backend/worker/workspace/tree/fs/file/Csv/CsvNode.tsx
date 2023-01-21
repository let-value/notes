import { memo } from "react";
import { DocumentNode } from "../DocumentNode";
import { FileContentChildrenProps, FileContentNode } from "../FileContentNode";
import { FileLinkChildrenProps, FileLinkNode } from "../FileLinkNode";
import { SheetNode } from "./SheetNode";

const csvBody = (
    <FileLinkNode key="content">
        {memo(function LinkReciver({ link }: FileLinkChildrenProps) {
            return (
                <FileContentNode key="content">
                    {memo(function ContentReciver({ content }: FileContentChildrenProps) {
                        return <SheetNode link={link} content={content} />;
                    })}
                </FileContentNode>
            );
        })}
    </FileLinkNode>
);

export class CsvNode extends DocumentNode {
    render() {
        return csvBody;
    }
}
