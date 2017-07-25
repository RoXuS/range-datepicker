import * as ts from 'typescript';
import { AnalysisContext } from '../core/analysis-context';
import { LanguageAnalyzer } from '../core/language-analyzer';
export declare class TypeScriptAnalyzer implements LanguageAnalyzer<ts.Program> {
    private _context;
    constructor(analysisContext: AnalysisContext);
    analyze(url: string): ts.Program;
}
