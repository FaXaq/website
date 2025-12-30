import type { IncomingHttpHeaders } from "http2";

export function toIsomorphicHeaders(fastifyHeaders: IncomingHttpHeaders): Headers {
  const headers = new Headers();

  for (const [key, value] of Object.entries(fastifyHeaders)) {
    if (value !== undefined) {
      if (Array.isArray(value)) {
        // Handle multiple values for the same header
        value.forEach(v => headers.append(key, v));
      } else {
        headers.set(key, value);
      }
    }
  }

  return headers;
}