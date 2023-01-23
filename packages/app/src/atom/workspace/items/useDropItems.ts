import { context } from "@/atom/storeServices";
import { backend } from "messaging";
import { useRecoilCallback } from "recoil";
import { workspaceState } from "../workspace";
import { ListItem } from "./ListItem";

export const useDropItems = () =>
    useRecoilCallback(
        ({ snapshot }) =>
            async (args: ListItem[], target: ListItem<true>, effect = "move") => {
                const workspace = await snapshot.getPromise(workspaceState);

                const items = args.filter(
                    (item, _index, arr) => !item.parents.some((parent) => arr.some((x) => x.path === parent.path)),
                );

                for (const item of items) {
                    if (item.isDirectory) {
                        const query =
                            effect === "copy" ? backend.workspace.directory.copy : backend.workspace.directory.move;

                        await context.dispatcher.call(query, {
                            workspaceId: workspace.id,
                            path: item.path,
                            targetPath: target.path,
                        });
                    } else {
                        const query = effect === "copy" ? backend.workspace.file.copy : backend.workspace.file.move;

                        await context.dispatcher.call(query, {
                            workspaceId: workspace.id,
                            path: item.path,
                            targetPath: target.path,
                        });
                    }
                }
            },
        [],
    );
