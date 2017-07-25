import * as estree from 'estree';
import { JavaScriptDocument } from '../javascript/javascript-document';
import { ScannedPolymerProperty } from './polymer-element';
/**
 * Given a properties block (i.e. object literal), parses and extracts the
 * properties declared therein.
 *
 * @param node The value of the `properties` key in a Polymer 1 declaration, or
 *     the return value of the `properties` static getter in a Polymer 2 class.
 * @param document The containing JS document.
 */
export declare function analyzeProperties(node: estree.Node, document: JavaScriptDocument): ScannedPolymerProperty[];
