import Cookies from "js-cookie";

// https://www.better-auth.com/docs/concepts/cookies
const ACCESS_TOKEN_COOKIE_KEY = 'better-auth.session_token';

export const getCookieAuth = () => {
  const res = Cookies.get(ACCESS_TOKEN_COOKIE_KEY);
  if (!res) {
    throw new Error(`No entry ${ACCESS_TOKEN_COOKIE_KEY} in cookies`);
  }
  return res;
};

export const setCookieAuth = (token: string) => {
  Cookies.set(ACCESS_TOKEN_COOKIE_KEY, token);
};

export const deleteCookieAuth = () => {
  Cookies.remove(ACCESS_TOKEN_COOKIE_KEY);
};