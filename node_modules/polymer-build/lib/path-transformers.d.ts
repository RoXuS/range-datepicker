/**
 * Returns a properly encoded URL representing the relative URL from the root
 * to the target.  This function will throw an error if the target is outside
 * the root.  We use this to map a file from the filesystem to the relative
 * URL that represents it in the build.
 */
export declare function urlFromPath(root: string, target: string): string;
/**
 * Returns a filesystem path for the url, relative to the root.
 */
export declare function pathFromUrl(root: string, url: string): string;
/**
 * Returns a string where all Windows path separators are converted to forward
 * slashes.
 * NOTE(usergenic): We will generate only canonical Windows paths, but this
 * function is exported so that we can create a forward-slashed Windows root
 * path when dealing with the `sw-precache` library, which uses `glob` npm
 * module generates only forward-slash paths in building its `precacheConfig`
 * map.
 */
export declare function posixifyPath(filepath: string): string;
