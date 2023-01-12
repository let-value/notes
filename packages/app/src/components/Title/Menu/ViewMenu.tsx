import { MenuItem2 } from "@blueprintjs/popover2";
import { useObservableState } from "observable-hooks";
import { BehaviorSubject } from "rxjs";

export const showSidebarState = new BehaviorSubject(true);

export const ViewMenu = () => {
    const showSidebar = useObservableState(showSidebarState);

    return (
        <>
            <MenuItem2
                text="Show Side Bar"
                icon={showSidebar ? "tick" : undefined}
                onClick={() => showSidebarState.next(!showSidebar)}
            />
        </>
    );
};

ViewMenu.displayName = "View";
