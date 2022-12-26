import { AtomEffect } from "recoil";
import { Workspace } from "../../domain/Workspace";

export const workspaceSelectEffect: AtomEffect<Workspace | undefined> = ({ onSet, setSelf }) => {
    onSet((newValue) => {
        if (newValue) {
            console.log("workspaceSelectEffect: ", newValue);
            //parseWorker.postMessage(new ParseWorkspaceAction(newValue.id));
        }
        setSelf(newValue);
    });
};
