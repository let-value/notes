export const worker = new Worker(new URL("./backend/worker.ts", import.meta.url), { type: "module" });
