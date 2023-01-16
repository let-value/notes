import { EditorPanelProps } from "@/components/EditorPanel/EditorPanelProps";
import { ReactiveValue } from "@/utils";
import { DockviewApi } from "dockview";
import { map } from "rxjs";

export const editorsDock$ = new ReactiveValue<DockviewApi>();

export const activePanel$ = editorsDock$.pipe(map((dock) => dock?.activePanel));
export const activePanelParams$ = activePanel$.pipe(map((panel) => panel?.params as EditorPanelProps));
