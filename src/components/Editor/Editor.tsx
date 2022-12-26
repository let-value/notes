import { FC } from "react";
import { File } from "../../domain";

interface EditorProps {
    file?: File;
}

export const Editor: FC<EditorProps> = ({ file }) => {
    return null;
    // const editorRef = useRef<monaco.editor.IStandaloneCodeEditor>();
    // const monacoEl = useRef<HTMLDivElement>(null);

    // const handleLoad = useCallback(async (file: EditorProps["file"] = null) => {
    //     if (!file || !editorRef.current) {
    //         return;
    //     }

    //     const fileHandle = await file.getFile();
    //     const fileContents = await fileHandle.text();
    //     editorRef.current?.setValue(fileContents);
    // }, []);

    // const handleSave = useCallback(async (file: EditorProps["file"] = null) => {
    //     if (!file || !editorRef.current) {
    //         return;
    //     }

    //     const data = editorRef.current.getValue();
    //     if (!data) {
    //         return;
    //     }

    //     const stream = await file.createWritable();
    //     await stream.write({ type: "write", data });
    //     stream.close();
    // }, []);

    // useEffect(() => {
    //     if (!monacoEl.current) {
    //         return;
    //     }

    //     const currentFile = file;

    //     const editor = monaco.editor.create(monacoEl.current, { language: "markdown" });

    //     editor.addCommand(
    //         monaco.KeyMod.chord(
    //             monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS,
    //             monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS,
    //         ),
    //         () => handleSave(currentFile),
    //     );
    //     editorRef.current = editor;

    //     return () => {
    //         handleSave(currentFile);
    //         editor?.dispose();
    //     };
    // }, [file, handleSave]);

    // useEffect(() => {
    //     const currentFile = file;

    //     handleLoad(currentFile);

    //     return () => {
    //         handleSave(currentFile);
    //     };
    // }, [file, handleLoad, handleSave]);

    // return <Pane ref={monacoEl} height="100%" width="100%" />;
};
