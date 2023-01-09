import "./wasm_exec.js";

globalThis.rcValidResolve ??= function () {
    console.log("rcValidResolve");
};

const go = new globalThis.Go();
const { instance } = await WebAssembly.instantiateStreaming(
    fetch(new URL("./rclone.wasm", import.meta.url)),
    go.importObject,
);

await go.run(instance);

export function rc(command: string, args: object): object {
    return globalThis.rc?.(command, args);
}
