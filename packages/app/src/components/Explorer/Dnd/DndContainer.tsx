import { ComponentProps, FC, useMemo, useRef, useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useMount } from "react-use";
import { DndScrolling } from "./DndScrolling";

export const DndContainer: FC<ComponentProps<"div">> = ({ children, ...other }) => {
    const context = useRef(null);

    const [rootElement, setRootElement] = useState(context.current);
    useMount(() => {
        setRootElement(context.current);
    });
    const html5Options = useMemo(() => ({ rootElement }), [rootElement]);

    return (
        <div ref={context} {...other}>
            {rootElement ? (
                <DndProvider backend={HTML5Backend} options={html5Options}>
                    {children}
                    <DndScrolling ref={context} />
                </DndProvider>
            ) : null}
        </div>
    );
};
