import { ReactiveValue } from "@/utils";
import { RecoilValue } from "recoil";

export interface ObserverState<T = any> {
    id: number;
    atom: RecoilValue<T>;
    subject: ReactiveValue<T>;
}
