import { ScannedImport, ScannedInlineDocument } from '../model/model';
import { HtmlVisitor, ParsedHtmlDocument } from './html-document';
import { HtmlScanner } from './html-scanner';
export declare class HtmlStyleScanner implements HtmlScanner {
    scan(document: ParsedHtmlDocument, visit: (visitor: HtmlVisitor) => Promise<void>): Promise<{
        features: (ScannedImport | ScannedInlineDocument)[];
    }>;
}
