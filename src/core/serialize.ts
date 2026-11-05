// Content as the text of a file: a string as it is, anything else as JSON (2 spaces, final newline).
export function serialize(content: string | object): string {
  return typeof content === "string" ? content : `${JSON.stringify(content, null, 2)}\n`;
}
