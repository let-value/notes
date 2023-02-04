import { EditorPanelProps } from "@/components/EditorPanel/EditorPanelProps";
import { ReactiveValue } from "@/utils";
import { DockviewApi, IDisposable } from "dockview";
import { filter, fromEventPattern, map, race, shareReplay, take } from "rxjs";
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

race(editorsDock$, editorsLayout$)
    .pipe(
        filter((x) => x !== undefined),
        take(1),
    )
    .subscribe((dock) => {
        const layout = localStorage.getItem("editorsLayout");
        if (layout && dock) {
            dock.fromJSON(JSON.parse(layout));
        }
    });

editorsLayout$.subscribe((dock) => {
    if (!dock) {
        return;
    }
    const layout = dock.toJSON();
    localStorage.setItem("editorsLayout", JSON.stringify(layout));
});

export const activePanel$ = editorsLayout$.pipe(
    map((dock) => dock?.activePanel),
    shareReplay(1),
);
export const activePanelParams$ = activePanel$.pipe(
    map((panel) => panel?.params as EditorPanelProps),
    shareReplay(1),
);
