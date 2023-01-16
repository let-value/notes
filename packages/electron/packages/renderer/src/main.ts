const { container } = await import("./container");
await import("./controllers");
await import("app/src/main");

container.get("electronMainMenu");

export {};
