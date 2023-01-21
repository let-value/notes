import { EditorPanelProps } from "@/components/EditorPanel/EditorPanelProps";
import { ReactiveValue } from "@/utils";
import { DockviewApi, IDisposable } from "dockview";
import { fromEventPattern, map, mergeMap, shareReplay } from "rxjs";

export const editorsDock$ = new ReactiveValue<DockviewApi>();

export const editorsLayout$ = editorsDock$.valuePipe.pipe(
    mergeMap((dock) =>
        fromEventPattern(
            (handler) => dock.onDidLayoutChange(handler),
            (_, signal: IDisposable) => signal.dispose(),
        ),
    ),
    mergeMap(() => editorsDock$.valuePipe),
);

export const activePanel$ = editorsLayout$.pipe(
    map((dock) => dock?.activePanel),
    shareReplay(1),
);
export const activePanelParams$ = activePanel$.pipe(
    map((panel) => panel?.params as EditorPanelProps),
    shareReplay(1),
);
