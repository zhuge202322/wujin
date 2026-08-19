export async function apiRequest(url, options = {}) {
  const response = await fetch(url, options);
  const result = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(result.error?.message || 'The request could not be completed.');
  return result.data;
}

export function jsonOptions(method, value) {
  return {
    method,
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(value)
  };
}
