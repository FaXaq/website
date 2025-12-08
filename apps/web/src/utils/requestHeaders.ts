import { createIsomorphicFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";

export const getRequestHeaders = createIsomorphicFn()
  .client(() => ({}))
  .server(() => {
    const headers = getRequest().headers;
    const headersObj: Record<string, string> = {};
    headers.forEach((value, key) => {
      headersObj[key] = value;
    });
    return headersObj;
  });