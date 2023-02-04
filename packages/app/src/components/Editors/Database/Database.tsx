import { databaseMetaState } from "@/atom/database/databaseMetaState";
import { Tab, Tabs } from "@blueprintjs/core";
import { FC, Suspense } from "react";
import { useRecoilValue } from "recoil";
import { EditorProps } from "../EditorProps";
import { View } from "./View";

export const Database: FC<EditorProps> = ({ workspace, item }) => {
    const meta = useRecoilValue(databaseMetaState({ workspaceId: workspace.id, path: item.path }));

    return (
        <div className="p-4">
            <Tabs id="TabsExample" defaultSelectedTabId={meta?.views[0].name}>
                {meta?.views.map((view) => (
                    <Tab
                        id={view.name}
                        title={view.name}
                        key={view.name}
                        panel={
                            <Suspense>
                                <View workspace={workspace} item={item} meta={meta} view={view} />
                            </Suspense>
                        }
                    />
                ))}
            </Tabs>
        </div>
    );
};
