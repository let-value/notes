import { Queue } from "./queue";

export class QueueService extends Queue {}

export const queueService = {
    queue: (): QueueService => new Queue({ concurrency: 1 }),
};
