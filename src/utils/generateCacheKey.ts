import crypto from "crypto"

export function generateCacheKey(header: string, filter: object) {
  const filterStr = JSON.stringify(filter);
  const hash = crypto.createHash("sha256").update(filterStr).digest("hex");
  return `${header}:${hash}`;
}