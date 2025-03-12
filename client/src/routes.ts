/**
 * ### Configuration for controlling route access.
 *
 * This configuration defines various route patterns to control access based on authentication and roles.
 *
 * @examples
 * 
 * ### 1. Simple Wildcards
 * Matches one or more segments in the route.
 * 
 * @example
 * Route: `/users/*path`
 * Matches:
 * - `/users/123`
 * - `/users/profile/settings`
 * 
 * ### 2. Nested Segments
 * Matches multiple segments within the same path.
 * 
 * @example
 * Route: `/items/:itemId/details`
 * Matches:
 * - `/items/123/details`
 * - `/items/456/details`
 * 
 * ### 3. Multiple Nested Segments
 * Matches paths with multiple dynamic parameters.
 * 
 * @example
 * Route: `/user/:userId/settings/:settingType`
 * Matches:
 * - `/user/123/settings/email`
 * - `/user/456/settings/password`
 * 
 * ### 4. File Extension Wildcards
 * Matches paths that include a file extension.
 * 
 * @example
 * Route: `/files/:fileName.:ext`
 * Matches:
 * - `/files/document.pdf`
 * - `/files/image.png`
 */

  /**
   * Routes that are publicly accessible without authentication.
   * These routes do not require any user to be logged in.
   * 
   * @type {string[]}
   * @example
   * ['/', '/new-password', '/docs', '/onboarding', '/onboarding/*path']
   */
  export const publicRoutes = [
    '/', 
    '/new-password',
    '/new-password/verify',
    '/logout',
    '/onboarding',
    '/onboarding/*path',
    '/docs',
    '/docs/*path'
  ];
  
  
/**
 * Routes that are used for authentication.
 * Logged-in users will be redirected to DEFAULT_LOGIN_REDIRECT if they attempt to access these routes.
 * 
 * @type {string[]}
 * @example
 */
export const authRoutes = [
    '/login', 
    '/signup', 
    '/logout', 
    '/verify'
  ];
  

  /**
   * The default redirect URL after a successful login.
   * 
   * @type {string}
   * @example
   * '/dashboard'
   */
  export const DEFAULT_LOGIN_REDIRECT = '/dashboard';
  
  /**
   * The default redirect URL after logout.
   * 
   * @type {string}
   * @example
   * '/login'
   */
  
  export const DEFAULT_LOGOUT_REDIRECT = '/';
  