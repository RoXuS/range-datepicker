/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
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
import * as estree from 'estree';
import { Document, Feature, Resolvable, SourceRange, Warning } from '../model/model';
import { Annotation as JsDocAnnotation } from './jsdoc';
/**
 * The metadata for a JavaScript namespace.
 */
export declare class ScannedNamespace implements Resolvable {
    name: string;
    description?: string;
    summary?: string;
    jsdoc?: JsDocAnnotation;
    sourceRange: SourceRange;
    astNode: estree.Node;
    warnings: Warning[];
    constructor(name: string, description: string, summary: string, astNode: estree.Node, jsdoc: JsDocAnnotation, sourceRange: SourceRange);
    resolve(_document: Document): Namespace;
}
declare module '../model/queryable' {
    interface FeatureKindMap {
        'namespace': Namespace;
    }
}
export declare class Namespace implements Feature {
    name: string;
    description?: string;
    summary?: string;
    kinds: Set<string>;
    identifiers: Set<string>;
    sourceRange: SourceRange;
    astNode: any;
    warnings: Warning[];
    constructor(scannedNamespace: ScannedNamespace);
    toString(): string;
}
