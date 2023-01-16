import { Loadable, RecoilValue } from "recoil";
import { BehaviorSubject } from "rxjs";

export interface ObserverState<T = any> {
    id: number;
    atom: RecoilValue<T>;
    subject: BehaviorSubject<Loadable<T>>;
}
