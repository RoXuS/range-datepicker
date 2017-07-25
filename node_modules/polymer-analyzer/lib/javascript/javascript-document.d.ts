import { Node, Program } from 'estree';
import { SourceRange } from '../model/model';
import { Options as ParsedDocumentOptions, ParsedDocument, StringifyOptions } from '../parser/document';
import { Visitor } from './estree-visitor';
export { Visitor } from './estree-visitor';
export interface Options extends ParsedDocumentOptions<Program> {
    parsedAsSourceType: 'script' | 'module';
}
export declare class JavaScriptDocument extends ParsedDocument<Node, Visitor> {
    type: string;
    private visitorSkips;
    ast: Program;
    /**
     * How the js document was parsed. If 'module' then the source code is
     * definitely an ES6 module, as it has imports or exports. If 'script' then
     * it may be an ES6 module with no imports or exports, or it may be a
     * script.
     */
    parsedAsSourceType: 'script' | 'module';
    constructor(from: Options);
    visit(visitors: Visitor[]): void;
    forEachNode(callback: (node: Node) => void): void;
    protected _sourceRangeForNode(node: Node): SourceRange | undefined;
    stringify(options: StringifyOptions): string;
}
