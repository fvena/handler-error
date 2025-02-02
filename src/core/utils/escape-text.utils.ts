export function escapeText(input: string): string {
  const map: Record<string, string> = {
    '"': "&quot;",
    "&": "&amp;",
    "'": "&#039;",
    "/": "&#x2F;",
    "<": "&lt;",
    ">": "&gt;",
    "`": "&#x60;",
  };

  return input.replaceAll(/[&<>"'`/]/g, (char) => map[char] ?? "");
}
