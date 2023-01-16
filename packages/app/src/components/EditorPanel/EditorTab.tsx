import { isFileHasChanges } from "@/atom/file/fileChangesState";
import { Icon } from "@blueprintjs/core";
import cx from "classnames";
import { IDockviewPanelHeaderProps, PanelCollection } from "dockview";
import { useObservable, useObservableState } from "observable-hooks";
import { FC, MouseEvent, useCallback, useRef } from "react";
import { useRecoilValue } from "recoil";
import { fromEventPattern } from "rxjs";
import { useHover } from "usehooks-ts";
import { EditorPanelProps } from "./EditorPanelProps";
import styles from "./EditorTab.module.css";

const EditorTab: FC<IDockviewPanelHeaderProps<EditorPanelProps>> = ({ api, params: { item } }) => {
    const tabRef = useRef<HTMLDivElement>(null);
    const hover = useHover(tabRef);

    const hasChanges = useRecoilValue(isFileHasChanges(item.path));

    const onContextMenu = useCallback((event: MouseEvent) => {
        event.preventDefault();
        alert("context menu");
    }, []);

    const active$ = useObservable(
        () =>
            fromEventPattern<boolean>(
                (handler) => api.onDidActiveChange(handler),
                (_, signal) => signal.dispose(),
                (event) => event.isActive,
            ),
        [api],
    );

    const active = useObservableState(active$, false);

    const handleClose = useCallback(() => {
        api.close();
    }, [api]);

    return (
        <div
            ref={tabRef}
            className={cx("default-tab", styles.tab, { [styles.active]: active, [styles.changes]: hasChanges })}
            onContextMenu={onContextMenu}
        >
            <div className="tab-content">{item.name}</div>
            <div className="action-container">
                <ul className="tab-list">
                    <div className={cx("tab-action", styles.close)}>
                        <Icon icon={hasChanges && !hover ? "dot" : "cross"} onClick={handleClose} />
                    </div>
                </ul>
            </div>
        </div>
    );
};

const id = "editor";

const collection: PanelCollection<IDockviewPanelHeaderProps> = {
    [id]: EditorTab as FC<IDockviewPanelHeaderProps>,
};

export const editorTab = { id, collection };
