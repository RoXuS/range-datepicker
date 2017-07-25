import { HtmlVisitor, ParsedHtmlDocument } from '../html/html-document';
import { HtmlScanner } from '../html/html-scanner';
import { ScannedPolymerElement } from './polymer-element';
/**
 * A Polymer pseudo-element is an element that is declared in an unusual way,
 * such
 * that the analyzer couldn't normally analyze it, so instead it is declared in
 * comments.
 */
export declare class PseudoElementScanner implements HtmlScanner {
    scan(document: ParsedHtmlDocument, visit: (visitor: HtmlVisitor) => Promise<void>): Promise<{
        features: ScannedPolymerElement[];
    }>;
}
