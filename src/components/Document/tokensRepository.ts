import { Token } from "@/domain";
import { editor } from "monaco-editor";
import { BehaviorSubject, Subject } from "rxjs";

const voidSubject = new Subject<Token[]>();
const markdownTokenSubjects = new WeakMap<editor.ITextModel, BehaviorSubject<Token[]>>();

export function getMarkdownTokensSubject(model: editor.ITextModel) {
    let result = markdownTokenSubjects.get(model);
    if (!result) {
        result = new BehaviorSubject<Token[]>([]);
        markdownTokenSubjects.set(model, result);
    }
    return result;
}

export function getModelTokensSubject(model: editor.ITextModel) {
    const language = model.getLanguageId();
    if (language === "markdown") {
        return getMarkdownTokensSubject(model);
    }
    return voidSubject;
}
