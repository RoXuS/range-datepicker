import { ScannedImport } from '../model/model';
import { Scanner } from '../scanning/scanner';
import { Node, ParsedTypeScriptDocument, Visitor } from './typescript-document';
export declare class TypeScriptImportScanner implements Scanner<ParsedTypeScriptDocument, Node, Visitor> {
    scan(document: ParsedTypeScriptDocument, visit: (visitor: Visitor) => Promise<void>): Promise<{
        features: ScannedImport[];
    }>;
}
