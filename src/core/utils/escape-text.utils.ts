const ESCAPE_REGEX = /[&<>"'`/]/g;

const ESCAPE_MAP: Record<string, string> = {
  '"': "&quot;",
  "&": "&amp;",
  "'": "&#039;",
  "/": "&#x2F;",
  "<": "&lt;",
  ">": "&gt;",
  "`": "&#x60;",
};

export function escapeText(input: string): string {
  return input.replaceAll(ESCAPE_REGEX, (char) => ESCAPE_MAP[char] ?? "");
}
