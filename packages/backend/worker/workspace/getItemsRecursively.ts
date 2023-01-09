import path from "path";

// if (!self?.process?.cwd) {
//     self.process = { cwd: () => "" } as never;
// }

export const getItemsRecursively = async function* (
    entry: FileSystemHandle,
    parentPath?: string,
): AsyncGenerator<[FileSystemHandle, string]> {
    const newPath = parentPath ? path.resolve(parentPath, entry.name) : "/";

    if (entry.kind === "directory") {
        yield [entry, newPath];

        for await (const handle of (entry as FileSystemDirectoryHandle).values()) {
            yield* getItemsRecursively(handle, newPath);
        }
    } else {
        yield [entry, newPath];
    }
};
