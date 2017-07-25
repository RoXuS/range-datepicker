/// <reference types="vinyl" />
/// <reference types="node" />
import { Analyzer, UrlLoader, Warning } from 'polymer-analyzer';
import { ProjectConfig } from 'polymer-project-config';
import File = require('vinyl');
export interface DocumentDeps {
    imports: Array<string>;
    scripts: Array<string>;
    styles: Array<string>;
}
export interface DepsIndex {
    depsToFragments: Map<string, string[]>;
    fragmentToDeps: Map<string, string[]>;
    fragmentToFullDeps: Map<string, DocumentDeps>;
}
export declare class BuildAnalyzer {
    config: ProjectConfig;
    loader: StreamLoader;
    analyzer: Analyzer;
    started: boolean;
    sourceFilesLoaded: boolean;
    private _sourcesStream;
    private _sourcesProcessingStream;
    private _dependenciesStream;
    private _dependenciesProcessingStream;
    files: Map<string, File>;
    warnings: Set<Warning>;
    allFragmentsToAnalyze: Set<string>;
    foundDependencies: Set<string>;
    analyzeDependencies: Promise<DepsIndex>;
    _dependencyAnalysis: DepsIndex;
    _resolveDependencyAnalysis: (index: DepsIndex) => void;
    constructor(config: ProjectConfig);
    /**
     * Start analysis by setting up the sources and dependencies analysis
     * pipelines and starting the source stream. Files will not be loaded from
     * disk until this is called. Can be called multiple times but will only run
     * set up once.
     */
    startAnalysis(): void;
    /**
     * Return _dependenciesOutputStream, which will contain fully loaded file
     * objects for each dependency after analysis.
     */
    dependencies(): NodeJS.ReadableStream;
    /**
     * Return _sourcesOutputStream, which will contain fully loaded file
     * objects for each source after analysis.
     */
    sources(): NodeJS.ReadableStream;
    /**
     * Resolve a file in our loader so that the analyzer can read it.
     */
    resolveFile(file: File): void;
    /**
     * Analyze a file to find additional dependencies to load. Currently we only
     * get dependencies for application fragments. When all fragments are
     * analyzed, we call _done() to signal that analysis is complete.
     */
    analyzeFile(file: File): Promise<void>;
    /**
     * Perform some checks once we know that `_sourcesStream` is done loading.
     */
    private onSourcesStreamComplete();
    /**
     * Helper function for emitting a general analysis error onto both file
     * streams.
     */
    private emitAnalysisError(err);
    /**
     * Called when analysis is complete and there are no more files to analyze.
     * Checks for serious errors before resolving its dependency analysis and
     * ending the dependency stream (which it controls).
     */
    private _done();
    getFile(filepath: string): File | undefined;
    getFileByUrl(url: string): File | undefined;
    /**
     * A side-channel to add files to the loader that did not come through the
     * stream transformation. This is for generated files, like
     * shared-bundle.html. This should probably be refactored so that the files
     * can be injected into the stream.
     */
    addFile(file: File): void;
    printWarnings(): void;
    private countWarningsByType();
    /**
     * Attempts to retreive document-order transitive dependencies for `url`.
     */
    _getDependencies(url: string): Promise<DocumentDeps>;
    _addDependencies(filePath: string, deps: DocumentDeps): void;
    /**
     * Check that the source stream has not already completed loading by the
     * time
     * this file was analyzed.
     */
    sourcePathAnalyzed(filePath: string): void;
    /**
     * Push the given filepath into the dependencies stream for loading.
     * Each dependency is only pushed through once to avoid duplicates.
     */
    dependencyPathAnalyzed(filePath: string): void;
}
export declare type ResolveFileCallback = (a: string) => void;
export declare type RejectFileCallback = (err: Error) => void;
export declare type DeferredFileCallbacks = {
    resolve: ResolveFileCallback;
    reject: RejectFileCallback;
};
export declare class StreamLoader implements UrlLoader {
    config: ProjectConfig;
    private _buildAnalyzer;
    deferredFiles: Map<string, DeferredFileCallbacks>;
    constructor(buildAnalyzer: BuildAnalyzer);
    hasDeferredFile(filePath: string): boolean;
    hasDeferredFiles(): boolean;
    resolveDeferredFile(filePath: string, file: File): void;
    rejectDeferredFile(filePath: string, err: Error): void;
    canLoad(url: string): boolean;
    load(url: string): Promise<string>;
}
