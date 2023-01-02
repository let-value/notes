import { createHash, type BinaryLike } from "crypto";

export function sha256sum(data: BinaryLike) {
    return createHash("sha256").update(data).digest("hex");
}
