/// <reference path="../../custom_typings/main.d.ts" />
import { Analysis } from '../model/model';
import { Parser } from '../parser/parser';
import { Scanner } from '../scanning/scanner';
import { UrlLoader } from '../url-loader/url-loader';
import { UrlResolver } from '../url-loader/url-resolver';
import { AnalysisContext } from './analysis-context';
export interface Options {
    urlLoader: UrlLoader;
    urlResolver?: UrlResolver;
    parsers?: Map<string, Parser<any>>;
    scanners?: ScannerTable;
    lazyEdges?: LazyEdgeMap;
    __contextPromise?: Promise<AnalysisContext>;
}
/**
 * These are the options available to the `_fork` method.  Currently, only the
 * `urlLoader` override is implemented.
 */
export interface ForkOptions {
    urlLoader?: UrlLoader;
}
export declare class NoKnownParserError extends Error {
}
export declare type ScannerTable = Map<string, Scanner<any, any, any>[]>;
export declare type LazyEdgeMap = Map<string, string[]>;
/**
 * A static analyzer for web projects.
 *
 * An Analyzer can load and parse documents of various types, and extract
 * arbitrary information from the documents, and transitively load
 * dependencies. An Analyzer instance is configured with parsers, and scanners
 * which do the actual work of understanding different file types.
 */
export declare class Analyzer {
    private _analysisComplete;
    private readonly _urlResolver;
    private readonly _urlLoader;
    constructor(options: Options);
    /**
     * Loads, parses and analyzes the root document of a dependency graph and its
     * transitive dependencies.
     */
    analyze(urls: string[]): Promise<Analysis>;
    analyzePackage(): Promise<Analysis>;
    /**
     * Clears all information about the given files from our caches, such that
     * future calls to analyze() will reload these files if they're needed.
     *
     * The analyzer assumes that if this method isn't called with a file's url,
     * then that file has not changed and does not need to be reloaded.
     *
     * @param urls The urls of files which may have changed.
     */
    filesChanged(urls: string[]): Promise<void>;
    /**
     * Clear all cached information from this analyzer instance.
     *
     * Note: if at all possible, instead tell the analyzer about the specific
     * files that changed rather than clearing caches like this. Caching provides
     * large performance gains.
     */
    clearCaches(): Promise<void>;
    /**
     * Returns a copy of the analyzer.  If options are given, the AnalysisContext
     * is also forked and individual properties are overridden by the options.
     * is forked with the given options.
     *
     * When the analysis context is forked, its cache is preserved, so you will
     * see a mixture of pre-fork and post-fork contents when you analyze with a
     * forked analyzer.
     *
     * Note: this feature is experimental. It may be removed without being
     *     considered a breaking change, so check for its existence before calling
     *     it.
     */
    _fork(options?: ForkOptions): Analyzer;
    /**
     * Returns `true` if the provided resolved URL can be loaded.  Obeys the
     * semantics defined by `UrlLoader` and should only be used to check
     * resolved URLs.
     */
    canLoad(resolvedUrl: string): boolean;
    /**
     * Loads the content at the provided resolved URL.  Obeys the semantics
     * defined by `UrlLoader` and should only be used to attempt to load resolved
     * URLs.
     */
    load(resolvedUrl: string): Promise<string>;
    /**
     * Returns `true` if the given `url` can be resolved.
     */
    canResolveUrl(url: string): boolean;
    /**
     * Resoves `url` to a new location.
     */
    resolveUrl(url: string): string;
}
