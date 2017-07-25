/**
 * A string representing a URL.
 */
export declare type UrlString = string;
export declare function ensureTrailingSlash(href: UrlString): UrlString;
/**
 * Returns a URL with the basename removed from the pathname.  Strips the
 * search off of the URL as well, since it will not apply.
 */
export declare function stripUrlFileSearchAndHash(href: UrlString): UrlString;
/**
 * Returns true if the href is an absolute path.
 */
export declare function isAbsolutePath(href: UrlString): boolean;
/**
 * Returns true if the href is a templated value, i.e. `{{...}}` or `[[...]]`
 */
export declare function isTemplatedUrl(href: UrlString): boolean;
/**
 * Computes the most succinct form of a relative URL representing the path from
 * the `fromUri` to the `toUri`.  Function is URL aware, not path-aware, so
 * `/a/` is correctly treated as a folder path where `/a` is not.
 */
export declare function relativeUrl(fromUri: UrlString, toUri: UrlString): UrlString;
/**
 * Modifies an href by the relative difference between the old base url and
 * the new base url.
 */
export declare function rewriteHrefBaseUrl(href: UrlString, oldBaseUrl: UrlString, newBaseUrl: UrlString): UrlString;
