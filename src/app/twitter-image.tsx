// Reuse the Open Graph image for Twitter/X cards. `runtime` must be a literal
// in this file (Next can't read it through a re-export).
export const runtime = "edge";
export { default, size, contentType, alt } from "./opengraph-image";
