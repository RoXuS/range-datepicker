import { InlineDocInfo } from '../model/model';
import { Parser } from '../parser/parser';
import { ParsedTypeScriptDocument } from './typescript-document';
/**
 * A TypeScript parser that only parses a single file, not imported files.
 * This parser is suitable for parsing ES6 as well.
 *
 * This parser uses a TypeScript CompilerHost that resolves all imported
 * modules to null, and resolve the standard library to an empty file.
 * Type checking against the result will be riddled with errors, but the
 * parsed AST can be used to find imports.
 *
 * This parser may eventually be replaced with a lightweight parser that
 * can find import statements, but due to the addition of the import()
 * function, it could be that a full parse is needed anyway.
 */
export declare class TypeScriptPreparser implements Parser<ParsedTypeScriptDocument> {
    parse(contents: string, url: string, inlineInfo?: InlineDocInfo<any>): ParsedTypeScriptDocument;
}
