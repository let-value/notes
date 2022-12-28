import { v4 as uuidv4 } from "uuid";

export const id = uuidv4();

let isWindow = true;

try {
    isWindow = self instanceof Window;
} catch {
    isWindow = false;
}

console.info(isWindow ? "window" : "worker", id);
