import { ScannedImport } from '../model/model';
import { Visitor } from './estree-visitor';
import { JavaScriptDocument } from './javascript-document';
import { JavaScriptScanner } from './javascript-scanner';
export declare class JavaScriptImportScanner implements JavaScriptScanner {
    scan(document: JavaScriptDocument, visit: (visitor: Visitor) => Promise<void>): Promise<{
        features: ScannedImport[];
        warnings: never[];
    }>;
}
