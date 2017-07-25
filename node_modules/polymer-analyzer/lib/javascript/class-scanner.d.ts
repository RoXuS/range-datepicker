import * as estree from 'estree';
import { ScannedClass, ScannedFeature, ScannedProperty, Warning } from '../model/model';
import { ScannedPolymerElement } from '../polymer/polymer-element';
import { ScannedPolymerElementMixin } from '../polymer/polymer-element-mixin';
import { Visitor } from './estree-visitor';
import { JavaScriptDocument } from './javascript-document';
import { JavaScriptScanner } from './javascript-scanner';
export interface ScannedAttribute extends ScannedFeature {
    name: string;
    type?: string;
}
/**
 * Find and classify classes from source code.
 *
 * Currently this has a bunch of Polymer stuff baked in that shouldn't be here
 * in order to support generating only one feature for stuff that's essentially
 * more specific kinds of classes, like Elements, PolymerElements, Mixins, etc.
 *
 * In a future change we'll add a mechanism whereby plugins can claim and
 * specialize classes.
 */
export declare class ClassScanner implements JavaScriptScanner {
    scan(document: JavaScriptDocument, visit: (visitor: Visitor) => Promise<void>): Promise<{
        features: (ScannedClass | ScannedPolymerElement | ScannedPolymerElementMixin)[];
        warnings: Warning[];
    }>;
    private _makeElementFeature(element, document);
    private _getObservers(node, document);
    private _getObservedAttributes(node, document);
    /**
     * Extract attributes from the array expression inside a static
     * observedAttributes method.
     *
     * e.g.
     *     static get observedAttributes() {
     *       return [
     *         /** @type {boolean} When given the element is totally inactive *\/
     *         'disabled',
     *         /** @type {boolean} When given the element is expanded *\/
     *         'open'
     *       ];
     *     }
     */
    private _extractAttributesFromObservedAttributes(arry, document);
}
export declare function extractPropertiesFromConstructor(astNode: estree.Node, document: JavaScriptDocument): Map<string, ScannedProperty>;
