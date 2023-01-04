/* eslint-disable @typescript-eslint/no-explicit-any */
import { createDocument } from "@ampproject/worker-dom/dist/server-lib.mjs";

// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-var
self.window = self;

self.document = createDocument();
(self.document as any).head = self.document.createDocumentFragment();
(self.document as any).body = self.document.createDocumentFragment();
(self.window as any).HTMLIFrameElement = self.document.createElement("iframe").constructor;
const element: any = self.document.createElement("div");
element.prototype = self.document.createElement("div");
(self.Element as any) = element;
self.document.queryCommandSupported = () => false;

const noop = () => {
    //noop
};
self.window.matchMedia = () => ({ matches: false, addEventListener: noop } as any);
