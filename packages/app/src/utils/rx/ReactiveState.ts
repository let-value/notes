import { Draft, produce } from "immer";
import { BehaviorSubject } from "rxjs";

export class ReactiveState<TState> extends BehaviorSubject<TState | undefined> {
    constructor(initialState?: TState) {
        super(initialState);
    }
    produce(recipe: (draft: Draft<TState>) => void) {
        const newValue = produce(this.getValue(), recipe);
        this.next(newValue);
    }
}
