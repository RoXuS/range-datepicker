/**
 * @license
 * Copyright (c) 2016 The Polymer Project Authors. All rights reserved.
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
import { Document } from './document';
import { Feature } from './feature';
import { AnalysisQuery as Query, AnalysisQueryWithKind as QueryWithKind, FeatureKind, FeatureKindMap, Queryable } from './queryable';
import { Warning } from './warning';
/**
 * Represents a queryable interface over all documents in a package/project.
 *
 * Results of queries will include results from all documents in the package, as
 * well as from external dependencies that are transitively imported by
 * documents in the package.
 */
export declare class Analysis implements Queryable {
    private readonly _results;
    private readonly _searchRoots;
    static isExternal(path: string): boolean;
    constructor(results: Map<string, Document | Warning>);
    getDocument(url: string): Document | Warning | undefined;
    /**
     * Get features in the package.
     *
     * Be default this includes features in all documents inside the package,
     * but you can specify whether to also include features that are outside the
     * package reachable by documents inside. See the documentation for Query for
     * more details.
     *
     * You can also narrow by feature kind and identifier.
     */
    getFeatures<K extends FeatureKind>(query: QueryWithKind<K>): Set<FeatureKindMap[K]>;
    getFeatures(query?: Query): Set<Feature>;
    /**
     * Get all warnings in the project.
     */
    getWarnings(options?: Query): Warning[];
    private _getDocumentQuery(query?);
}
