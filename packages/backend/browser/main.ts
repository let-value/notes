const { container } = await import("backend-worker/container");
const { backend } = await import("messaging");

export { container };
const id = container.get("id");

await import("backend-worker/controllers");

const dispatcher = container.get("dispatcher");
const response = backend.leader.response(id, undefined);

dispatcher.send(response);
