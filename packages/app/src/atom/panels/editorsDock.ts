import { EditorPanelProps } from "@/components/EditorPanel/EditorPanelProps";
import { ReactiveValue } from "@/utils";
import { DockviewApi, IDisposable } from "dockview";
import { fromEventPattern, map, shareReplay } from "rxjs";
import { switchMap } from "rxjs/internal/operators/switchMap";

export const editorsDock$ = new ReactiveValue<DockviewApi>();

export const editorsLayout$ = editorsDock$.valuePipe.pipe(
    switchMap((dock) =>
        fromEventPattern(
            (handler) => dock.onDidLayoutChange(handler),
            (_, signal: IDisposable) => signal.dispose(),
        ),
    ),
    switchMap(() => editorsDock$.valuePipe),
);

export const activePanel$ = editorsLayout$.pipe(
    map((dock) => dock?.activePanel),
    shareReplay(1),
);
export const activePanelParams$ = activePanel$.pipe(
    map((panel) => panel?.params as EditorPanelProps),
    shareReplay(1),
);
