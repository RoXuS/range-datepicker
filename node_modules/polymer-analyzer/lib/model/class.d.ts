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
import * as jsdocLib from '../javascript/jsdoc';
import { Document, Feature, Method, Privacy, Property, Reference, Resolvable, ScannedFeature, ScannedMethod, ScannedProperty, ScannedReference, SourceRange, Warning } from '../model/model';
import { Demo } from './element-base';
import { ImmutableMap } from './immutable';
/**
 * Represents a JS class as encountered in source code.
 *
 * We only emit a ScannedClass when there's not a more specific kind of feature.
 * Like, we don't emit a ScannedClass when we encounter an element or a mixin
 * (though in the future those features will likely extend from
 * ScannedClass/Class).
 *
 * TODO(rictic): currently there's a ton of duplicated code across the Class,
 *     Element, Mixin, PolymerElement, and PolymerMixin classes. We should
 *     really unify this stuff to a single representation and set of algorithms.
 */
export declare class ScannedClass implements ScannedFeature, Resolvable {
    readonly name: string | undefined;
    /** The name of the class in the local scope where it is defined. */
    readonly localName: string | undefined;
    readonly astNode: estree.Node;
    readonly jsdoc: jsdocLib.Annotation;
    readonly description: string;
    readonly summary: string;
    readonly sourceRange: SourceRange;
    readonly properties: Map<string, ScannedProperty>;
    readonly staticMethods: ImmutableMap<string, ScannedMethod>;
    readonly methods: ImmutableMap<string, ScannedMethod>;
    readonly superClass: ScannedReference | undefined;
    readonly mixins: ScannedReference[];
    readonly abstract: boolean;
    readonly privacy: Privacy;
    readonly warnings: Warning[];
    readonly demos: {
        desc?: string;
        path: string;
    }[];
    constructor(className: string | undefined, localClassName: string | undefined, astNode: estree.Node, jsdoc: jsdocLib.Annotation, description: string, sourceRange: SourceRange, properties: Map<string, ScannedProperty>, methods: Map<string, ScannedMethod>, staticMethods: Map<string, ScannedMethod>, superClass: ScannedReference | undefined, mixins: ScannedReference[], privacy: Privacy, warnings: Warning[], abstract: boolean, demos: Demo[]);
    resolve(document: Document): Feature | undefined;
}
declare module '../model/queryable' {
    interface FeatureKindMap {
        'class': Class;
    }
}
export interface ClassInit {
    readonly sourceRange: SourceRange | undefined;
    readonly astNode: any;
    readonly warnings?: Warning[];
    readonly summary: string;
    readonly name?: string;
    readonly className?: string;
    readonly jsdoc?: jsdocLib.Annotation;
    readonly description: string;
    readonly properties?: ImmutableMap<string, Property>;
    readonly staticMethods: ImmutableMap<string, Method>;
    readonly methods?: ImmutableMap<string, Method>;
    readonly superClass?: ScannedReference | undefined;
    readonly mixins?: ScannedReference[];
    readonly abstract: boolean;
    readonly privacy: Privacy;
    readonly demos?: Demo[];
}
export declare class Class implements Feature {
    readonly kinds: Set<string>;
    readonly identifiers: Set<string>;
    readonly sourceRange: SourceRange | undefined;
    readonly astNode: any;
    readonly warnings: Warning[];
    readonly summary: string;
    readonly name: string | undefined;
    /**
     * @deprecated use the `name` field instead.
     */
    readonly className: string | undefined;
    readonly jsdoc: jsdocLib.Annotation | undefined;
    description: string;
    readonly properties: Map<string, Property>;
    readonly methods: Map<string, Method>;
    readonly staticMethods: Map<string, Method>;
    readonly superClass: Reference | undefined;
    /**
     * Mixins that this class declares with `@mixes`.
     *
     * Mixins are applied linearly after the superclass, in order from first
     * to last. Mixins that compose other mixins will be flattened into a
     * single list. A mixin can be applied more than once, each time its
     * members override those before it in the prototype chain.
     */
    readonly mixins: Reference[];
    readonly abstract: boolean;
    readonly privacy: Privacy;
    demos: Demo[];
    private readonly _parsedDocument;
    constructor(init: ClassInit, document: Document);
    protected inheritFrom(superClass: Class): void;
    /**
     * This method is applied to an array of members to overwrite members lower in
     * the prototype graph (closer to Object) with members higher up (closer to
     * the final class we're constructing).
     *
     * @param . existing The array of members so far. N.B. *This param is
     *   mutated.*
     * @param . overriding The array of members from this new, higher prototype in
     *   the graph
     * @param . overridingClassName The name of the prototype whose members are
     *   being applied over the existing ones. Should be `undefined` when
     *   applyingSelf is true
     * @param . applyingSelf True on the last call to this method, when we're
     *   applying the class's own local members.
     */
    protected _overwriteInherited<P extends PropertyLike>(existing: Map<string, P>, overriding: ImmutableMap<string, P>, overridingClassName: string | undefined, applyingSelf?: boolean): void;
    /**
     * Returns the elementLikes that make up this class's prototype chain.
     *
     * Should return them in the order that they're constructed in JS
     * engine (i.e. closest to HTMLElement first, closest to `this` last).
     */
    protected _getSuperclassAndMixins(document: Document, _init: ClassInit): Class[];
    protected _resolveReferenceToSuperClass(reference: Reference | undefined, document: Document, kind: 'class'): Class | undefined;
    emitMetadata(): object;
    emitPropertyMetadata(_property: Property): object;
    emitMethodMetadata(_method: Method): object;
}
export interface PropertyLike {
    name: string;
    sourceRange?: SourceRange;
    inheritedFrom?: string;
    privacy?: Privacy;
}
