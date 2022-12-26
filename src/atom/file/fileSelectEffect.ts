import { AtomEffect } from "recoil";
import { File } from "../../domain/File";

export const fileSelectEffect: AtomEffect<File | undefined> = ({ onSet, setSelf }) => {
    onSet((newValue) => {
        if (newValue) {
            //parseWorker.postMessage(new ParseFileAction(newValue.workspaceId, newValue.id));
        }
        setSelf(newValue);
    });
};
