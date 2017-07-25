import * as jsdoc from '../javascript/jsdoc';
import { ScannedEvent } from '../model/model';
import { ScannedPolymerElement } from './polymer-element';
/**
 * Annotates Hydrolysis scanned features, processing any descriptions as
 * JSDoc.
 *
 * You probably want to use a more specialized version of this, such as
 * `annotateElement`.
 *
 * Processed JSDoc values will be made available via the `jsdoc` property on a
 * scanned feature.
 */
export declare function annotate(feature: {
    jsdoc?: jsdoc.Annotation;
    description?: string;
}): void;
/**
 * Annotates @event, @hero, & @demo tags
 */
export declare function annotateElementHeader(scannedElement: ScannedPolymerElement): void;
/**
 * Annotates event documentation
 */
export declare function annotateEvent(annotation: jsdoc.Annotation): ScannedEvent;
