import { Warning } from '../model/model';
import { Visitor } from './estree-visitor';
import { JavaScriptDocument } from './javascript-document';
import { JavaScriptScanner } from './javascript-scanner';
import { ScannedNamespace } from './namespace';
export declare class NamespaceScanner implements JavaScriptScanner {
    scan(document: JavaScriptDocument, visit: (visitor: Visitor) => Promise<void>): Promise<{
        features: ScannedNamespace[];
        warnings: Warning[];
    }>;
}
