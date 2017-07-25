/**
 * @license
 * Copyright (c) 2015 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
import { Document, ScannedDocument, Warning } from '../model/model';
import { ParsedDocument } from '../parser/document';
import { AsyncWorkCache } from './async-work-cache';
import { DependencyGraph } from './dependency-graph';
export declare class AnalysisCache {
    /**
     * These are maps from resolved URLs to Promises of various stages of the
     * analysis pipeline.
     */
    readonly parsedDocumentPromises: AsyncWorkCache<string, ParsedDocument>;
    readonly scannedDocumentPromises: AsyncWorkCache<string, ScannedDocument>;
    readonly dependenciesScannedPromises: AsyncWorkCache<string, ScannedDocument>;
    readonly analyzedDocumentPromises: AsyncWorkCache<string, Document>;
    /**
     * TODO(rictic): These synchronous caches need to be kept in sync with their
     *     async work cache analogues above.
     */
    readonly scannedDocuments: Map<string, ScannedDocument>;
    readonly analyzedDocuments: Map<string, Document>;
    readonly failedDocuments: Map<string, Warning>;
    readonly dependencyGraph: DependencyGraph;
    /**
     * @param from Another AnalysisCache to copy the caches from. The new
     *   AnalysisCache will have an independent copy of everything but from's
     *   dependency graph, which is passed in separately.
     * @param newDependencyGraph If given, use this dependency graph. We pass
     *   this in like this purely as an optimization. See `invalidatePaths`.
     */
    constructor(from?: AnalysisCache, newDependencyGraph?: DependencyGraph);
    /**
     * Returns a copy of this cache, with the given document and all of its
     * transitive dependants invalidated.
     *
     * Must be called whenever a document changes.
     */
    invalidate(documentPaths: string[]): AnalysisCache;
    toString(): string;
}
