import { Node } from 'typescript';
import { SourceRange } from '../model/model';
import { Options, ParsedDocument, StringifyOptions } from '../parser/document';
import { Visitor } from './typescript-visitor';
export { Node, Program } from 'typescript';
export { Options } from '../parser/document';
export { Visitor } from './typescript-visitor';
export declare class ParsedTypeScriptDocument extends ParsedDocument<Node, Visitor> {
    type: string;
    constructor(from: Options<Node>);
    visit(visitors: Visitor[]): void;
    forEachNode(_callback: (node: Node) => void): void;
    protected _sourceRangeForNode(_node: Node): SourceRange | undefined;
    stringify(_options: StringifyOptions): string;
}
