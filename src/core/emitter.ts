// Events without node:events, so the core runs wherever a Host can be written.
// Every Element is an Emitter: listen to a model with on(), tell its listeners with emit().
//   const craftbook = new BOS.Craftbook(host, path);
//   craftbook.on("created", (path) => console.log("new:", path));

export type Listener = (...args: unknown[]) => void;

export class Emitter {
  // the listeners of each event, in the order they were added
  #listeners = new Map<string, Listener[]>();

  on(event: string, listener: Listener): this {
    const listeners = this.#listeners.get(event) ?? [];
    this.#listeners.set(event, [...listeners, listener]);
    return this;
  }

  // a listener called on the next emit only
  once(event: string, listener: Listener): this {
    const wrapped: Listener = (...args) => {
      this.off(event, wrapped);
      listener(...args);
    };
    return this.on(event, wrapped);
  }

  off(event: string, listener: Listener): this {
    const listeners = this.#listeners.get(event) ?? [];
    this.#listeners.set(
      event,
      listeners.filter((each) => each !== listener),
    );
    return this;
  }

  // true when someone was listening
  emit(event: string, ...args: unknown[]): boolean {
    const listeners = this.#listeners.get(event) ?? [];
    for (const listener of listeners) {
      listener(...args);
    }
    return listeners.length > 0;
  }
}
