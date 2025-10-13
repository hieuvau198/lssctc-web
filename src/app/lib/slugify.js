// Simple reusable slugify utility
export function slugify(str) {
  return String(str || "")
    .toLowerCase()
    .trim()
    // remove non-word chars except spaces and hyphens
    .replace(/[^a-z0-9\s-]/g, "")
    // collapse whitespace to single hyphen
    .replace(/\s+/g, "-")
    // collapse multiple hyphens
    .replace(/-+/g, "-");
}

export default slugify;
