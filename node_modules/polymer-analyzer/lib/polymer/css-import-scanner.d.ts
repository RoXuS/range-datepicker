import { HtmlVisitor, ParsedHtmlDocument } from '../html/html-document';
import { HtmlScanner } from '../html/html-scanner';
import { ScannedImport } from '../model/model';
export declare class CssImportScanner implements HtmlScanner {
    scan(document: ParsedHtmlDocument, visit: (visitor: HtmlVisitor) => Promise<void>): Promise<{
        features: ScannedImport[];
        warnings: never[];
    }>;
}
