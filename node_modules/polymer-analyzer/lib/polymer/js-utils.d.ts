import * as estree from 'estree';
import { SourceRange } from '../model/model';
import { ParsedDocument } from '../parser/document';
import { ScannedPolymerProperty } from './polymer-element';
/**
 * Create a ScannedProperty object from an estree Property AST node.
 */
export declare function toScannedPolymerProperty(node: estree.Property | estree.MethodDefinition, sourceRange: SourceRange, document: ParsedDocument): ScannedPolymerProperty;
