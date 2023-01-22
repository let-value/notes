import { useEffect } from "react";
import { useRafState } from "react-use";

export interface State {
    x: number;
    y: number;
    altKey: boolean;
}

const useMouseState = (): State => {
    const [state, setState] = useRafState<State>({
        x: 0,
        y: 0,
        altKey: false,
    });

    useEffect(() => {
        const moveHandler = (event: MouseEvent) => {
            setState({
                x: event.pageX,
                y: event.pageY,
                altKey: event.altKey,
            });
        };

        document.addEventListener("mousemove", moveHandler);

        return () => {
            document.removeEventListener("mousemove", moveHandler);
        };
    }, [setState]);

    return state;
};

export default useMouseState;
