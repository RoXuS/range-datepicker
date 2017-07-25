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
import { SourceRange } from './model';
import { Resolvable } from './resolvable';
import { Warning } from './warning';
/**
 * Represents an import, such as an HTML import, an external script or style
 * tag, or an JavaScript import.
 *
 * @template N The AST node type
 */
export declare class ScannedImport implements Resolvable {
    type: 'html-import' | 'html-script' | 'html-style' | 'js-import' | string;
    /**
     * URL of the import, relative to the base directory.
     */
    url: string;
    sourceRange: SourceRange | undefined;
    error: {
        message?: string;
    } | undefined;
    /**
     * The source range specifically for the URL or reference to the imported
     * resource.
     */
    urlSourceRange: SourceRange | undefined;
    astNode: any | null;
    warnings: Warning[];
    /**
     * If true, the imported document may not be loaded until well after the
     * containing document has been evaluated, and indeed may never load.
     */
    lazy: boolean;
    constructor(type: string, url: string, sourceRange: SourceRange | undefined, urlSourceRange: SourceRange | undefined, ast: any | null, lazy: boolean);
    resolve(document: Document): Import | undefined;
}
declare module './queryable' {
    interface FeatureKindMap {
        'import': Import;
        'lazy-import': Import;
        'html-import': Import;
        'html-script': Import;
        'html-style': Import;
        'js-import': Import;
        'css-import': Import;
    }
}
export declare class Import implements Feature {
    readonly type: 'html-import' | 'html-script' | 'html-style' | string;
    readonly url: string;
    readonly document: Document;
    readonly identifiers: Set<any>;
    readonly kinds: Set<string>;
    readonly sourceRange: SourceRange | undefined;
    readonly urlSourceRange: SourceRange | undefined;
    readonly astNode: any | null;
    readonly warnings: Warning[];
    readonly lazy: boolean;
    constructor(url: string, type: string, document: Document, sourceRange: SourceRange | undefined, urlSourceRange: SourceRange | undefined, ast: any, warnings: Warning[], lazy: boolean);
    toString(): string;
}
