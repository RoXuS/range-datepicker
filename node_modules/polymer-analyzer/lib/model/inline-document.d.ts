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
import * as dom5 from 'dom5';
import { ASTNode } from 'parse5';
import { Document, ScannedDocument } from './document';
import { ScannedFeature } from './feature';
import { Resolvable } from './resolvable';
import { LocationOffset, SourceRange } from './source-range';
import { Warning } from './warning';
export interface InlineDocInfo<AstNode> {
    astNode?: AstNode;
    locationOffset?: LocationOffset;
}
/**
 * Represents an inline document, usually a <script> or <style> tag in an HTML
 * document.
 *
 * @template N The AST node type
 */
export declare class ScannedInlineDocument implements ScannedFeature, Resolvable {
    type: 'html' | 'javascript' | 'css' | string;
    contents: string;
    /** The location offset of this document within the containing document. */
    locationOffset: LocationOffset;
    attachedComment?: string;
    scannedDocument?: ScannedDocument;
    sourceRange: SourceRange;
    warnings: Warning[];
    astNode: dom5.Node;
    constructor(type: string, contents: string, locationOffset: LocationOffset, attachedComment: string, sourceRange: SourceRange, ast: dom5.Node);
    resolve(document: Document): Document | undefined;
}
declare module './queryable' {
    interface FeatureKindMap {
        'inline-document': InlineDocument;
    }
}
export declare class InlineDocument extends Document {
    constructor(base: ScannedDocument, containerDocument: Document);
}
export declare function getAttachedCommentText(node: ASTNode): string | undefined;
export declare function getLocationOffsetOfStartOfTextContent(node: ASTNode): LocationOffset;
