import * as estree from 'estree';
import { ScannedMethod } from '../index';
import { ImmutableSet } from '../model/immutable';
import { Privacy } from '../model/model';
import { ScannedEvent, SourceRange } from '../model/model';
import { ParsedDocument } from '../parser/document';
import { JavaScriptDocument } from './javascript-document';
import * as jsdoc from './jsdoc';
/**
 * Returns whether an Espree node matches a particular object path.
 *
 * e.g. you have a MemberExpression node, and want to see whether it represents
 * `Foo.Bar.Baz`:
 *    matchesCallExpressio
    (node, ['Foo', 'Bar', 'Baz'])
 *
 * @param {ESTree.Node} expression The Espree node to match against.
 * @param {Array<string>} path The path to look for.
 */
export declare function matchesCallExpression(expression: estree.MemberExpression, path: string[]): boolean;
/**
 * @param {Node} key The node representing an object key or expression.
 * @return {string} The name of that key.
 */
export declare function objectKeyToString(key: estree.Node): string | undefined;
export declare const CLOSURE_CONSTRUCTOR_MAP: Map<string, string>;
/**
 * AST expression -> Closure type.
 *
 * Accepts literal values, and native constructors.
 *
 * @param {Node} node An Espree expression node.
 * @return {string} The type of that expression, in Closure terms.
 */
export declare function closureType(node: estree.Node, sourceRange: SourceRange, document: ParsedDocument): string;
export declare function getAttachedComment(node: estree.Node): string | undefined;
/**
 * Returns all comments from a tree defined with @event.
 */
export declare function getEventComments(node: estree.Node): Map<string, ScannedEvent>;
export declare function getPropertyValue(node: estree.ObjectExpression, name: string): estree.Node | undefined;
export declare function isFunctionType(node: estree.Node): node is estree.Function;
/**
 * Create a ScannedMethod object from an estree Property AST node.
 */
export declare function toScannedMethod(node: estree.Property | estree.MethodDefinition, sourceRange: SourceRange, document: ParsedDocument): ScannedMethod;
export declare function getOrInferPrivacy(name: string, annotation: jsdoc.Annotation | undefined, defaultPrivacy?: Privacy): Privacy;
/**
 * Properties on element prototypes that are part of the custom elment lifecycle
 * or Polymer configuration syntax.
 *
 * TODO(rictic): only treat the Polymer ones as private when dealing with
 *   Polymer.
 */
export declare const configurationProperties: ImmutableSet<string>;
/**
 * Scan any methods on the given node, if it's a class expression/declaration.
 */
export declare function getMethods(node: estree.Node, document: JavaScriptDocument): Map<string, ScannedMethod>;
/**
 * Scan any static methods on the given node, if it's a class
 * expression/declaration.
 */
export declare function getStaticMethods(node: estree.Node, document: JavaScriptDocument): Map<string, ScannedMethod>;
