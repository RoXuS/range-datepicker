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
import * as estree from 'estree';
import * as jsdoc from '../javascript/jsdoc';
import { ParsedDocument } from '../parser/document';
import { Class, ClassInit } from './class';
import { Privacy } from './feature';
import { ImmutableArray } from './immutable';
import { ScannedMethod } from './method';
import { Attribute, Document, Event, Feature, Resolvable, ScannedAttribute, ScannedEvent, ScannedProperty, ScannedReference, SourceRange, Warning } from './model';
export { Visitor } from '../javascript/estree-visitor';
/**
 * Base class for ScannedElement and ScannedElementMixin.
 */
export declare abstract class ScannedElementBase implements Resolvable {
    properties: Map<string, ScannedProperty>;
    attributes: Map<string, ScannedAttribute>;
    description: string;
    summary: string;
    demos: {
        desc?: string;
        path: string;
    }[];
    events: Map<string, ScannedEvent>;
    sourceRange: SourceRange | undefined;
    staticMethods: Map<string, ScannedMethod>;
    methods: Map<string, ScannedMethod>;
    astNode: estree.Node | null;
    warnings: Warning[];
    jsdoc?: jsdoc.Annotation;
    'slots': Slot[];
    mixins: ScannedReference[];
    privacy: Privacy;
    abstract: boolean;
    superClass?: ScannedReference;
    applyHtmlComment(commentText: string | undefined, containingDocument: ParsedDocument | undefined): void;
    resolve(_document: Document): any;
}
export declare class Slot {
    name: string;
    range: SourceRange;
    constructor(name: string, range: SourceRange);
}
export interface Demo {
    desc?: string;
    path: string;
}
export interface ElementBaseInit extends ClassInit {
    readonly events?: Map<string, Event>;
    readonly attributes?: Map<string, Attribute>;
    readonly slots?: Slot[];
}
/**
 * Base class for Element and ElementMixin.
 */
export declare abstract class ElementBase extends Class implements Feature {
    attributes: Map<string, Attribute>;
    events: Map<string, Event>;
    'slots': ImmutableArray<Slot>;
    constructor(init: ElementBaseInit, document: Document);
    protected inheritFrom(superClass: Class): void;
    emitAttributeMetadata(_attribute: Attribute): Object;
    emitEventMetadata(_event: Event): Object;
}
