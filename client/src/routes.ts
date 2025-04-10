import { Role } from "./context/auth-context";

/**
 * Public API routes that should not have the access token attached.
 *
 * React Router's matchPath supports a simplified pattern syntax:
 *
 * - **Exact Match:**
 *   - `/accounts/login`
 *     Matches exactly `/accounts/login`.
 *
 * - **Wildcard (Splat) for Nested Routes:**
 *   - `/accounts/login/*`
 *     Matches `/accounts/login` and any sub-route like `/accounts/login/success` or `/accounts/login/error`.
 *
 * - **Parameterized Routes:**
 *   - `/accounts/verify/:token`
 *     Matches routes like `/accounts/verify/abc123` where `:token` is a dynamic segment.
 *
 * - **Catch-All Wildcard:**
 *   - `/*`
 *     Matches any route.
 *
 * Additional examples:
 *
 * ```js
 * // Example 1: Exact match
 * // Pattern: "/example" matches only "/example"
 * matchPath("/example", "/example"); // => Match object
 *
 * // Example 2: Wildcard nested routes
 * // Pattern: "/example/*" matches "/example", "/example/123", "/example/123/details", etc.
 * matchPath("/example/*", "/example/123"); // => Match object
 *
 * // Example 3: Parameterized route
 * // Pattern: "/example/:id" matches "/example/456" and extracts { id: "456" }
 * matchPath("/example/:id", "/example/456"); // => { params: { id: "456" } }
 *
 * // Example 4: Combination of parameter and wildcard
 * // Pattern: "/example/:id/*" matches "/example/789/foo/bar" and extracts { id: "789", "*": "foo/bar" }
 * matchPath("/example/:id/*", "/example/789/foo/bar"); // => { params: { id: "789", "*": "foo/bar" } }
 * ```
 *
 * @constant
 * @type {string[]}
 */
export const PUBLIC_API_ROUTES = [
  "/accounts/login",
  "/accounts/signup",
  "/accounts/verify",
  "/accounts/logout",
  "/accounts/token/refresh",
  "/accounts/password-reset",
];

export const PUBLIC_ROUTES = ["/auth/login", "/auth/signup", "/auth/verify", "/auth/reset-password"];

export const DASHBOARD_ROUTES: Record<Role, string> = {
  student: "/",
  lecturer: "/lecturer",
  registrar: "/admin",
  department_head: "/department-head",
};

/**
 * The default redirect URL after a successful login.
 *
 * @type {string}
 * @example
 * '/dashboard'
 */
export const DEFAULT_LOGIN_REDIRECT = "/dashboard";

/**
 * The default redirect URL after logout.
 *
 * @type {string}
 * @example
 * '/login'
 */

// export const DEFAULT_LOGOUT_REDIRECT = '/';  This causes a glitche when loging out
export const DEFAULT_LOGOUT_REDIRECT = "/auth/login";
