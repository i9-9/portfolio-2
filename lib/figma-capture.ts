/** True while a Figma html-to-design capture hash is active. */
export function isFigmaCapture(): boolean {
  if (typeof document === "undefined") return false;
  return document.documentElement.dataset.figmaCapture === "1";
}
