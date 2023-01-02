import { createDocument } from "@ampproject/worker-dom/dist/server-lib.mjs";

// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-var
self.window = self;

self.document = createDocument();
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(self.document as any).head = self.document.createDocumentFragment();
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const element: any = self.document.createElement("div");
element.prototype = self.document.createElement("div");
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(self.Element as any) = element;

const noop = () => {
    //noop
};
self.window.matchMedia = () => ({ matches: false, addEventListener: noop } as any);
