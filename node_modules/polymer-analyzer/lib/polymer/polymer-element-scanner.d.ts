import { Visitor } from '../javascript/estree-visitor';
import { JavaScriptDocument } from '../javascript/javascript-document';
import { JavaScriptScanner } from '../javascript/javascript-scanner';
import { Warning } from '../model/model';
import { ScannedPolymerElement } from './polymer-element';
export declare class PolymerElementScanner implements JavaScriptScanner {
    scan(document: JavaScriptDocument, visit: (visitor: Visitor) => Promise<void>): Promise<{
        features: ScannedPolymerElement[];
        warnings: Warning[];
    }>;
}
