import { Queue, QueueAddOptions } from "p-queue";

export declare type RunFunction = () => Promise<unknown>;

export interface LineOptions extends QueueAddOptions {
    priority?: number;
    type?: string;
}

export interface Job {
    run: RunFunction;
    options?: LineOptions;
}

export type Task<TResult> = ((options: LineOptions) => PromiseLike<TResult>) | ((options: LineOptions) => TResult);

export class QueueLine implements Queue<RunFunction, LineOptions> {
    items: Array<Job> = [];

    enqueue(run: RunFunction, options?: Partial<LineOptions>): void {
        this.items.push({ run, options });
        this.sort();
    }
    dequeue(): RunFunction | undefined {
        const item = this.items.shift();
        return item?.run;
    }
    promote(type: string, newPriority = 1) {
        const item = this.items.find((element) => element.options?.type === type);
        if (!item) {
            return;
        }
        const currentPriority = item.options?.priority ?? 0;
        item.options = Object.assign({}, item.options, { priority: Math.max(newPriority, currentPriority + 1) });
        this.sort();
    }
    filter(options: Readonly<Partial<LineOptions>>): RunFunction[] {
        return this.items
            .filter((element) => (element.options?.priority ?? 0) === options.priority)
            .map((element) => element.run);
    }
    sort() {
        this.items.sort((a, b) => (b.options?.priority ?? 0) - (a.options?.priority ?? 0));
    }
    get size() {
        return this.items.length;
    }
}
