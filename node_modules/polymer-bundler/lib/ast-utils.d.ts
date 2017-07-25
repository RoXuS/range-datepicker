import { ASTNode, ParserOptions } from 'parse5';
/**
 * Move the `node` to be the immediate sibling after the `target` node.
 * TODO(usergenic): Migrate this code to polymer/dom5 and when you do, use
 * insertNode which will handle the remove and the splicing in once you have
 * the index.
 */
export declare function insertAfter(target: ASTNode, node: ASTNode): void;
/**
 * Move the entire collection of nodes to be the immediate sibling before the
 * `after` node.
 */
export declare function insertAllBefore(target: ASTNode, after: ASTNode, nodes: ASTNode[]): void;
/**
 * Return true if node is a text node that is empty or consists only of white
 * space.
 */
export declare function isBlankTextNode(node: ASTNode): boolean;
/**
 * Return true if comment starts with a `!` character indicating it is an
 * "important" comment, needing preservation.
 */
export declare function isImportantComment(node: ASTNode): boolean;
/**
 * Return true if node is a comment node consisting of a license (annotated by
 * the `@license` string.)
 */
export declare function isLicenseComment(node: ASTNode): boolean;
/**
 * Return true if node is a comment node that is a server-side-include.  E.g.
 * <!--#directive ...-->
 */
export declare function isServerSideIncludeComment(node: ASTNode): boolean;
/**
 * Inserts the node as the first child of the parent.
 * TODO(usergenic): Migrate this code to polymer/dom5
 */
export declare function prepend(parent: ASTNode, node: ASTNode): void;
/**
 * Removes an AST Node and the whitespace-only text node following it, if
 * present.
 */
export declare function removeElementAndNewline(node: ASTNode, replacement?: ASTNode): void;
/**
 * A common pattern is to parse html and then remove the fake nodes.
 * This function dries up that pattern.
 */
export declare function parse(html: string, options: ParserOptions): ASTNode;
/**
 * Returns true if the nodes are given in order as they appear in the source
 * code.
 * TODO(usergenic): Port this to `dom5` and do it with typings for location info
 * instead of all of these string-based lookups.
 */
export declare function inSourceOrder(left: ASTNode, right: ASTNode): boolean;
/**
 * Returns true if both nodes have the same line and column according to their
 * location info.
 * TODO(usergenic): Port this to `dom5` and do it with typings for location info
 * instead of all of these string-based lookups.
 */
export declare function sameNode(node1: ASTNode, node2: ASTNode): boolean;
/**
 * Return all sibling nodes following node.
 */
export declare function siblingsAfter(node: ASTNode): ASTNode[];
/**
 * Find all comment nodes in the document, removing them from the document
 * if they are note license comments, and if they are license comments,
 * deduplicate them and prepend them in document's head.
 */
export declare function stripComments(document: ASTNode): void;
