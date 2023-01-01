import PQueue, { Options } from "p-queue";
import { LineOptions, QueueLine, Task } from "./QueueLine";

class Queue extends PQueue<QueueLine, LineOptions> {
    line: QueueLine;
    pendingPromises = new Map<string, Promise<unknown>>();
    constructor(options: Options<QueueLine, LineOptions>) {
        let line: QueueLineWrapper | undefined = undefined;
        class QueueLineWrapper extends QueueLine {
            constructor() {
                super();
                // eslint-disable-next-line @typescript-eslint/no-this-alias
                line = this;
            }
        }
        super({ ...options, queueClass: QueueLineWrapper });
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        this.line = line!;
    }
    add<TResult>(task: Task<TResult>, options?: Partial<LineOptions>): Promise<TResult> {
        if (options?.type) {
            const promise = this.pendingPromises.get(options.type);
            if (promise) {
                this.line.promote(options.type, options.priority);
                return promise as Promise<TResult>;
            }
        }

        const promise = super.add(task, options);
        if (options?.type) {
            this.pendingPromises.set(options.type, promise);
        }

        promise.finally(() => {
            if (options?.type) {
                this.pendingPromises.delete(options.type);
            }
        });

        return promise;
    }
}

export const queue = new Queue({ concurrency: 1 });
queue.on("add", () => {
    console.log(`Task is added.  Size: ${queue.size}  Pending: ${queue.pending}`);
});
queue.on("next", () => {
    console.log(`Task is completed.  Size: ${queue.size}  Pending: ${queue.pending}`);
});
