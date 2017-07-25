import { ScannedFeature, Warning } from '../model/model';
import { ParsedDocument } from '../parser/document';
import { Scanner } from './scanner';
export declare function scan<AstNode, Visitor, PDoc extends ParsedDocument<AstNode, Visitor>>(document: PDoc, scanners: Scanner<PDoc, AstNode, Visitor>[]): Promise<{
    features: ScannedFeature[];
    warnings: Warning[];
}>;
