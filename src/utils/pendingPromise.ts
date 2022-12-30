export function pendingPromise() {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        const original = descriptor.value;
        let pending: Promise<any> | undefined;
        if (typeof original === "function") {
            descriptor.value = async function (...args: unknown[]) {
                if (pending) {
                    return pending;
                }
                pending = original.apply(this, args);
                const result = await pending;
                pending = undefined;
                return result;
            };
        }
        return descriptor;
    };
}
