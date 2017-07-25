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
/**
 * This is a simple pattern to provide a readonly view of a normal javascript
 * collection. Note that this trades performance for protection. There's nothing
 * stoping a user from mutating one of these data structures, save a warning
 * that the typescript compiler may give them.
 *
 * Other options to consider are facebook's Immutable.js which provides a
 * variety of truely immutable data structures.
 */
/** A zero-overhead immutable view of an array. */
export interface ImmutableArray<V> {
    readonly [index: number]: V | undefined;
    readonly length: number;
    slice(left?: number, right?: number): Array<V>;
    map<U>(f: (v: V, idx: number) => U): Array<U>;
    forEach(f: (v: V, idx: number) => void): void;
    concat(...arrs: V[][]): Array<V>;
    [Symbol.iterator](): Iterator<V>;
}
/** A zero-overhead immutable view of a set. */
export interface ImmutableSet<V> {
    readonly size: number;
    has(candidate: V): boolean;
    values(): Iterable<V>;
    [Symbol.iterator](): Iterator<V>;
}
/** A zero-overhead immutable view of a map. */
export interface ImmutableMap<K, V> {
    readonly size: number;
    has(candidate: K): boolean;
    get(key: K): V | undefined;
    keys(): Iterable<K>;
    values(): Iterable<V>;
    entries(): Iterable<[K, V]>;
    [Symbol.iterator](): Iterator<[K, V]>;
}
export declare function asImmutable<V>(array: Array<V>): ImmutableArray<V>;
export declare function asImmutable<V>(set: Set<V>): ImmutableSet<V>;
export declare function asImmutable<K, V>(map: Map<K, V>): ImmutableMap<K, V>;
export declare function asImmutable<O extends object>(object: O): Readonly<O>;
/**
 * Take care, this function is inherently unsafe.
 *
 * You're taking a data structure that has been declare as immutable and getting
 * a mutable reference to it.
 */
export declare function unsafeAsMutable<V>(array: ImmutableArray<V>): Array<V>;
export declare function unsafeAsMutable<V>(set: ImmutableSet<V>): Set<V>;
export declare function unsafeAsMutable<K, V>(map: ImmutableMap<K, V>): Map<K, V>;
export declare function unsafeAsMutable<O extends object>(object: Readonly<O>): O;
