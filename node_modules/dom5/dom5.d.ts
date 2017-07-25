/// <reference path="custom_typings/main.d.ts" />
import { ASTNode as Node } from 'parse5';
export { ASTNode as Node } from 'parse5';
/**
 * @returns `true` iff [element] has the attribute [name], `false` otherwise.
 */
export declare function hasAttribute(element: Node, name: string): boolean;
export declare function hasSpaceSeparatedAttrValue(name: string, value: string): Predicate;
/**
 * @returns The string value of attribute `name`, or `null`.
 */
export declare function getAttribute(element: Node, name: string): string | null;
export declare function setAttribute(element: Node, name: string, value: string): void;
export declare function removeAttribute(element: Node, name: string): void;
/**
 * Normalize the text inside an element
 *
 * Equivalent to `element.normalize()` in the browser
 * See https://developer.mozilla.org/en-US/docs/Web/API/Node/normalize
 */
export declare function normalize(node: Node): void;
/**
 * Return the text value of a node or element
 *
 * Equivalent to `node.textContent` in the browser
 */
export declare function getTextContent(node: Node): string;
/**
 * Set the text value of a node or element
 *
 * Equivalent to `node.textContent = value` in the browser
 */
export declare function setTextContent(node: Node, value: string): void;
export declare type Predicate = (node: Node) => boolean;
export declare function isDocument(node: Node): boolean;
export declare function isDocumentFragment(node: Node): boolean;
export declare function isElement(node: Node): boolean;
export declare function isTextNode(node: Node): boolean;
export declare function isCommentNode(node: Node): boolean;
/**
 * Applies `mapfn` to `node` and the tree below `node`, returning a flattened
 * list of results.
 */
export declare function treeMap<U>(node: Node, mapfn: (node: Node) => U[]): U[];
export declare type GetChildNodes = (node: Node) => Node[] | undefined;
export declare const defaultChildNodes: GetChildNodes;
export declare const childNodesIncludeTemplate: GetChildNodes;
/**
 * Walk the tree down from `node`, applying the `predicate` function.
 * Return the first node that matches the given predicate.
 *
 * @returns `null` if no node matches, parse5 node object if a node matches.
 */
export declare function nodeWalk(node: Node, predicate: Predicate, getChildNodes?: GetChildNodes): Node | null;
/**
 * Walk the tree down from `node`, applying the `predicate` function.
 * All nodes matching the predicate function from `node` to leaves will be
 * returned.
 */
export declare function nodeWalkAll(node: Node, predicate: Predicate, matches?: Node[], getChildNodes?: GetChildNodes): Node[];
/**
 * Equivalent to `nodeWalk`, but only returns nodes that are either
 * ancestors or earlier cousins/siblings in the document.
 *
 * Nodes are searched in reverse document order, starting from the sibling
 * prior to `node`.
 */
export declare function nodeWalkPrior(node: Node, predicate: Predicate): Node | undefined;
/**
 * Walk the tree up from the parent of `node`, to its grandparent and so on to
 * the root of the tree.  Return the first ancestor that matches the given
 * predicate.
 */
export declare function nodeWalkAncestors(node: Node, predicate: Predicate): Node | undefined;
/**
 * Equivalent to `nodeWalkAll`, but only returns nodes that are either
 * ancestors or earlier cousins/siblings in the document.
 *
 * Nodes are returned in reverse document order, starting from `node`.
 */
export declare function nodeWalkAllPrior(node: Node, predicate: Predicate, matches?: Node[]): Node[];
/**
 * Equivalent to `nodeWalk`, but only matches elements
 */
export declare function query(node: Node, predicate: Predicate, getChildNodes?: GetChildNodes): Node | null;
/**
 * Equivalent to `nodeWalkAll`, but only matches elements
 */
export declare function queryAll(node: Node, predicate: Predicate, matches?: Node[], getChildNodes?: GetChildNodes): Node[];
export declare function cloneNode(node: Node): Node;
export declare function replace(oldNode: Node, newNode: Node): void;
export declare function remove(node: Node): void;
export declare function insertBefore(parent: Node, target: Node, newNode: Node): void;
export declare function insertAfter(parent: Node, target: Node, newNode: Node): void;
/**
 * Removes a node and places its children in its place.  If the node
 * has no parent, the operation is impossible and no action takes place.
 */
export declare function removeNodeSaveChildren(node: Node): void;
/**
 * When parse5 parses an HTML document with `parse`, it injects missing root
 * elements (html, head and body) if they are missing.  This function removes
 * these from the AST if they have no location info, so it requires that
 * the `parse5.parse` be used with the `locationInfo` option of `true`.
 */
export declare function removeFakeRootElements(ast: Node): void;
export declare function append(parent: Node, newNode: Node): void;
export declare const predicates: {
    hasClass: (name: string) => Predicate;
    hasAttr: (attr: string) => Predicate;
    hasAttrValue: (attr: string, value: string) => Predicate;
    hasMatchingTagName: (regex: RegExp) => Predicate;
    hasSpaceSeparatedAttrValue: (name: string, value: string) => Predicate;
    hasTagName: (name: string) => Predicate;
    hasTextValue: (value: string) => Predicate;
    AND: (...predicates: Predicate[]) => Predicate;
    OR: (...predicates: Predicate[]) => Predicate;
    NOT: (predicateFn: Predicate) => Predicate;
    parentMatches: (predicateFn: Predicate) => Predicate;
};
export declare const constructors: {
    text: (value: string) => Node;
    comment: (comment: string) => Node;
    element: (tagName: string, namespace?: string | undefined) => Node;
    fragment: () => Node;
};
