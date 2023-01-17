import { Component } from "react";
import { distinctUntilChanged, filter, Observable, shareReplay, Subject, Subscription } from "rxjs";

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
    subject: Subject<TProps>;
    pipeline: Observable<TValue>;
    value?: TValue;
    subsciption: Subscription;

    constructor(
        private readonly component: Component<TProps>,
        pipeline: (props$: Observable<TProps>) => Observable<TValue>,
    ) {
        this.subject = new Subject<TProps>();

        this.pipeline = pipeline(this.subject.pipe(distinctUntilChanged())).pipe(
            filter((value) => !!value),
            distinctUntilChanged(),
            shareReplay(1),
        );

        this.subsciption = this.pipeline.subscribe((value) => {
            this.value = value;
            this.component.forceUpdate();
        });

        const componentDidMount = findPropertyDescriptor(this.component, "componentDidMount");
        Object.defineProperty(this.component, "componentDidMount", {
            ...componentDidMount,
            value: () => {
                componentDidMount?.value.apply(this.component);
                this.subject.next(this.component.props);
            },
        });

        const componentDidUpdate = findPropertyDescriptor(this.component, "componentDidUpdate");
        Object.defineProperty(this.component, "componentDidUpdate", {
            ...componentDidUpdate,
            value: (...args: unknown[]) => {
                componentDidUpdate?.value.apply(this.component, args);
                this.subject.next(this.component.props);
            },
        });

        const componentWillUnmount = findPropertyDescriptor(this.component, "componentWillUnmount");
        Object.defineProperty(this.component, "componentWillUnmount", {
            ...componentWillUnmount,
            value: () => {
                componentWillUnmount?.value.apply(this.component);
                this.dispose();
            },
        });
    }
    dispose() {
        this.subject.complete();
        this.subsciption.unsubscribe();
    }
}
