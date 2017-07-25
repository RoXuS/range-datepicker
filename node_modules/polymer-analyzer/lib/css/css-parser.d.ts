import { InlineDocInfo } from '../model/model';
import { Parser } from '../parser/parser';
import { ParsedCssDocument } from './css-document';
export declare class CssParser implements Parser<ParsedCssDocument> {
    private _parser;
    constructor();
    parse(contents: string, url: string, inlineInfo?: InlineDocInfo<any>): ParsedCssDocument;
}
