import createMiddleware from "next-intl/middleware";

export default createMiddleware({
  // Supported languages
  locales: ["en", "mm"],

  // Default language
  defaultLocale: "en",
});

export const config = {
  // Skip paths like _next, api, static, etc.
  matcher: ["/((?!_next|.*\\..*).*)"],
};
