import { Visitor } from '../javascript/estree-visitor';
import { JavaScriptDocument } from '../javascript/javascript-document';
import { JavaScriptScanner } from '../javascript/javascript-scanner';
import { Warning } from '../model/model';
import { ScannedBehavior } from './behavior';
export declare class BehaviorScanner implements JavaScriptScanner {
    scan(document: JavaScriptDocument, visit: (visitor: Visitor) => Promise<void>): Promise<{
        features: ScannedBehavior[];
        warnings: Warning[];
    }>;
}
