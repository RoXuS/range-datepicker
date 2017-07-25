/**
 * Maintains bidirectional indexes of the dependency graph, for quick querying.
 */
export declare class DependencyGraph {
    private _documents;
    constructor(from?: DependencyGraph);
    private _getRecordFor(url);
    /**
     * Add dependencies of the given path.
     *
     * @param url The url of a document.
     * @param newDependencies The paths of that document's direct dependencies.
     */
    addDocument(url: string, dependencies: Iterable<string>): void;
    rejectDocument(url: string, error: Error): void;
    /**
     * Returns a Promise that resolves when the given document and all
     * of its transitive dependencies have been resolved or rejected. This
     * Promise never rejects, if the document or any dependencies are rejected,
     * the Promise still resolves.
     */
    whenReady(url: string): Promise<void>;
    private _whenReady(key, visited);
    /**
     * Returns a fork of this graph without the documents at the given paths.
     */
    invalidatePaths(paths: string[]): DependencyGraph;
    /**
     * Returns the set of transitive dependencies on the given path.
     *
     * So if A depends on B which depends on C, then getAllDependentsOf(C) will
     * be Set([A,B]), and getAllDependantsOf(B) will be Set([A]).
     */
    getAllDependantsOf(path: string): Set<string>;
    private _getAllDependantsOf(path, visited, result);
    toString(): string;
}
