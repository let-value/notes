import "./wasm_exec.js";

let rcValidResolve: () => void;

export const ready = new Promise<void>((resolve) => {
    rcValidResolve = resolve;
});

globalThis.rcValidResolve ??= function () {
    rcValidResolve();
};

const go = new globalThis.Go();
const { instance } = await WebAssembly.instantiateStreaming(
    fetch(new URL("./rclone.wasm", import.meta.url)),
    go.importObject,
);

export function rc(command: string, args: object): object {
    return globalThis.rc(command, args);
}

go.run(instance);
