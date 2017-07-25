import { Visitor } from './estree-visitor';
import { ScannedFunction } from './function';
import { JavaScriptDocument } from './javascript-document';
import { JavaScriptScanner } from './javascript-scanner';
export declare class FunctionScanner implements JavaScriptScanner {
    scan(document: JavaScriptDocument, visit: (visitor: Visitor) => Promise<void>): Promise<{
        features: ScannedFunction[];
    }>;
}
