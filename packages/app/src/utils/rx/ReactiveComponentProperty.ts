import { Component } from "react";
import {
    distinctUntilChanged,
    filter,
    firstValueFrom,
    Observable,
    ReplaySubject,
    skip,
    Subject,
    Subscription,
} from "rxjs";

function findPropertyDescriptor(obj: object, name: string): PropertyDescriptor | undefined {
    if (Object.prototype.hasOwnProperty.call(obj, name)) {
        return Object.getOwnPropertyDescriptor(obj, name);
    }

    const proto = Object.getPrototypeOf(obj);
    if (proto) {
        return findPropertyDescriptor(proto, name);
    }

    return undefined;
}

export class ReactiveComponentProperty<TProps, TValue> {
    props$: Subject<TProps>;
    pipeline$: ReplaySubject<TValue>;
    value?: TValue;
    private pipelineSubsciption: Subscription;
    private valueSubsciption: Subscription;

    constructor(
        private readonly component: Component<TProps>,
        pipeline: (props$: Observable<TProps>) => Observable<TValue>,
        defaultValue?: TValue,
    ) {
        this.value = defaultValue;
        this.props$ = new Subject<TProps>();

        const propsPipeline = this.props$.pipe(distinctUntilChanged());

        this.pipeline$ = new ReplaySubject(1);

        this.pipelineSubsciption = pipeline(propsPipeline)
            .pipe(
                filter((value) => value !== undefined),
                distinctUntilChanged(),
            )
            .subscribe((value) => {
                this.pipeline$.next(value);
            });

        this.valueSubsciption = this.pipeline$.subscribe((value) => {
            this.value = value;
            this.component.forceUpdate();
        });

        const componentDidMount = findPropertyDescriptor(this.component, "componentDidMount");
        Object.defineProperty(this.component, "componentDidMount", {
            ...componentDidMount,
            value: () => {
                componentDidMount?.value.apply(this.component);
                this.props$.next(this.component.props);
            },
            configurable: true,
        });

        const componentDidUpdate = findPropertyDescriptor(this.component, "componentDidUpdate");
        Object.defineProperty(this.component, "componentDidUpdate", {
            ...componentDidUpdate,
            value: (...args: unknown[]) => {
                componentDidUpdate?.value.apply(this.component, args);
                this.props$.next(this.component.props);
            },
            configurable: true,
        });

        const componentWillUnmount = findPropertyDescriptor(this.component, "componentWillUnmount");
        Object.defineProperty(this.component, "componentWillUnmount", {
            ...componentWillUnmount,
            value: () => {
                componentWillUnmount?.value.apply(this.component);
                this.dispose();
            },
            configurable: true,
        });
    }

    update() {
        const result = firstValueFrom(this.pipeline$.pipe(skip(1)));
        this.props$.next({ ...this.component.props });
        return result;
    }

    dispose() {
        this.props$.complete();
        this.pipeline$.complete();
        this.pipelineSubsciption.unsubscribe();
        this.valueSubsciption.unsubscribe();
    }
}
