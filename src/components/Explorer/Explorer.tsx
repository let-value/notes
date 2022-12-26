import { FC } from "react";
import { Workspace } from "../../domain/Workspace";

interface ExplorerProps {
    workspace: Workspace | undefined;
}

// const getItemsRecursively = async function* (entry: FileSystemHandle): AsyncGenerator<FileSystemHandle> {
//     if (entry.kind === "directory") {
//         yield entry;
//         for await (const handle of (entry as FileSystemDirectoryHandle).values()) {
//             yield* getItemsRecursively(handle);
//         }
//     } else {
//         yield entry;
//     }
// };

export const Explorer: FC<ExplorerProps> = () => {
    return null;
    // const file = useRecoilValue(fileState);
    // const [files, setFiles] = useState<(File | Directory)[]>([]);

    // const loadFiles = useCallback(async () => {
    //     for await (const handle of getItemsRecursively(workspace.handle)) {
    //         result.push({ handle });
    //     }
    // }, []);

    // const handleSelect = useSelectFile();

    // return (
    //     <Pane height="100%" width="100%">
    //         <Menu>
    //             {files?.map((item, index) => (
    //                 <Menu.Item
    //                     key={index}
    //                     icon={item.handle.kind === "directory" ? FolderCloseIcon : AnnotationIcon}
    //                     aria-checked={item.id === file?.id}
    //                     onSelect={() => handleSelect(item as File)}
    //                 >
    //                     {item.handle.name}
    //                 </Menu.Item>
    //             ))}
    //         </Menu>
    //     </Pane>
    // );
};
