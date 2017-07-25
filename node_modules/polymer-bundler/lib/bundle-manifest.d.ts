import { UrlString } from './url-utils';
/**
 * A bundle strategy function is used to transform an array of bundles.
 */
export declare type BundleStrategy = (bundles: Bundle[]) => Bundle[];
/**
 * A bundle url mapper function produces a map of urls to bundles.
 */
export declare type BundleUrlMapper = (bundles: Bundle[]) => Map<UrlString, Bundle>;
/**
 * A mapping of entrypoints to their full set of transitive dependencies,
 * such that a dependency graph `a->c, c->d, d->e, b->d, b->f` would be
 * represented `{a:[a,c,d,e], b:[b,d,e,f]}`.  Please note that there is an
 * explicit identity dependency (`a` depends on `a`, `b` depends on `b`).
 */
export declare type TransitiveDependenciesMap = Map<UrlString, Set<UrlString>>;
/**
 * A bundle is a grouping of files which serve the need of one or more
 * entrypoint files.
 */
export declare class Bundle {
    entrypoints: Set<UrlString>;
    files: Set<UrlString>;
    stripImports: Set<string>;
    missingImports: Set<string>;
    inlinedHtmlImports: Set<string>;
    inlinedScripts: Set<string>;
    inlinedStyles: Set<string>;
    constructor(entrypoints?: Set<UrlString>, files?: Set<UrlString>);
}
/**
 * Represents a bundle assigned to an output URL.
 */
export declare class AssignedBundle {
    bundle: Bundle;
    url: UrlString;
}
/**
 * A bundle manifest is a mapping of urls to bundles.
 */
export declare class BundleManifest {
    bundles: Map<UrlString, Bundle>;
    private _bundleUrlForFile;
    /**
     * Given a collection of bundles and a BundleUrlMapper to generate urls for
     * them, the constructor populates the `bundles` and `files` index properties.
     */
    constructor(bundles: Bundle[], urlMapper: BundleUrlMapper);
    fork(): BundleManifest;
    getBundleForFile(url: UrlString): AssignedBundle | undefined;
}
/**
 * Chains multiple bundle strategy functions together so the output of one
 * becomes the input of the next and so-on.
 */
export declare function composeStrategies(strategies: BundleStrategy[]): BundleStrategy;
/**
 * Given an index of files and their dependencies, produce an array of bundles,
 * where a bundle is defined for each set of dependencies.
 *
 * For example, a dependency index representing the graph:
 *   `a->b, b->c, b->d, e->c, e->f`
 *
 * Would produce an array of three bundles:
 *   `[a]->[a,b,d], [e]->[e,f], [a,e]->[c]`
 */
export declare function generateBundles(depsIndex: TransitiveDependenciesMap): Bundle[];
/**
 * Creates a bundle url mapper function which takes a prefix and appends an
 * incrementing value, starting with `1` to the filename.
 */
export declare function generateCountingSharedBundleUrlMapper(urlPrefix: UrlString): BundleUrlMapper;
/**
 * Generates a strategy function which finds all non-entrypoint bundles which
 * are dependencies of the given entrypoint and merges them into that
 * entrypoint's bundle.
 */
export declare function generateEagerMergeStrategy(entrypoint: UrlString): BundleStrategy;
/**
 * Generates a strategy function which finds all bundles matching the predicate
 * function and merges them into the bundle containing the target file.
 */
export declare function generateMatchMergeStrategy(predicate: (b: Bundle) => boolean): BundleStrategy;
/**
 * Creates a bundle url mapper function which maps non-shared bundles to the
 * urls of their single entrypoint and yields responsibility for naming
 * remaining shared bundle urls to the `mapper` function argument.  The
 * mapper function takes a collection of shared bundles and a url map, calling
 * `.set(url, bundle)` for each.
 */
export declare function generateSharedBundleUrlMapper(mapper: (sharedBundles: Bundle[]) => UrlString[]): BundleUrlMapper;
/**
 * Generates a strategy function to merge all bundles where the dependencies
 * for a bundle are shared by at least 2 entrypoints (default; set
 * `minEntrypoints` to change threshold).
 *
 * This function will convert an array of 4 bundles:
 *   `[a]->[a,b], [a,c]->[d], [c]->[c,e], [f,g]->[f,g,h]`
 *
 * Into the following 3 bundles, including a single bundle for all of the
 * dependencies which are shared by at least 2 entrypoints:
 *   `[a]->[a,b], [c]->[c,e], [a,c,f,g]->[d,f,g,h]`
 */
export declare function generateSharedDepsMergeStrategy(maybeMinEntrypoints?: number): BundleStrategy;
/**
 * A bundle strategy function which merges all shared dependencies into a
 * bundle for an application shell.
 */
export declare function generateShellMergeStrategy(shell: UrlString, maybeMinEntrypoints?: number): BundleStrategy;
/**
 * Generates a strategy function that ensures bundles do not link to given urls.
 * Bundles which contain matching files will still have them inlined.
 */
export declare function generateNoBackLinkStrategy(urls: UrlString[]): BundleStrategy;
/**
 * Given an Array of bundles, produce a single bundle with the entrypoints and
 * files of all bundles represented.
 */
export declare function mergeBundles(bundles: Bundle[]): Bundle;
/**
 * Return a new bundle array where all bundles within it matching the predicate
 * are merged.
 */
export declare function mergeMatchingBundles(bundles: Bundle[], predicate: (bundle: Bundle) => boolean): Bundle[];
