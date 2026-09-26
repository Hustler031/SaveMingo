export function createRequestId() {
  const token = crypto.randomUUID().replaceAll("-", "").slice(0, 10).toUpperCase();
  return `sm_${token}`;
}
