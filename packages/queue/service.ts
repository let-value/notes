import { Queue } from "./queue";

export const queueService = {
    queue: () => new Queue({ concurrency: 1 }),
};
