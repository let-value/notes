import { TreeItem } from "models";
import { File } from "./File";

interface DirectoryProps {
    item: TreeItem;
}

export function Directory({ item }: DirectoryProps) {
    if (!item.isDirectory) {
        return null;
    }

    return (
        <>
            {item.children.map((child) => {
                if (child.isDirectory) {
                    return <Directory key={child.path} item={child} />;
                } else {
                    return <File key={child.path} item={child} />;
                }
            })}
        </>
    );
}
