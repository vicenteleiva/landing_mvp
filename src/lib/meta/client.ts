export function createMetaEventId(prefix: string) {
  const base =
    typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
      ? crypto.randomUUID()
      : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
  return `${prefix}-${base}`;
}

export function getMetaBrowserIdentifiers() {
  const fbp = getCookie("_fbp") ?? undefined;
  const fbc = getCookie("_fbc") ?? undefined;
  return { fbp, fbc };
}

function getCookie(name: string) {
  if (typeof document === "undefined") return null;
  const cookies = document.cookie ? document.cookie.split(";") : [];
  for (const segment of cookies) {
    const [rawKey, ...rest] = segment.trim().split("=");
    if (rawKey === name) {
      return rest.join("=");
    }
  }
  return null;
}
