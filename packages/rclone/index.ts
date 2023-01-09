import "./wasm_exec.js";

globalThis.rcValidResolve ??= function () {
    console.log("rcValidResolve");
};

const go = new globalThis.Go();
const wasm = await WebAssembly.instantiateStreaming(fetch(new URL("./rclone.wasm", import.meta.url)), go.importObject);

export function rc(command: string, args: object): object {
    return globalThis.rc?.(command, args);
}

await go.run(wasm.instance);
