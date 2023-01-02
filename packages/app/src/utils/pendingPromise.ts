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
                try {
                    return await pending;
                } finally {
                    pending = undefined;
                }
            };
        }
        return descriptor;
    };
}
