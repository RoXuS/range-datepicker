import { ParsedDocument } from '../parser/document';
import { SourceRange } from './source-range';
export interface WarningInit {
    readonly message: string;
    readonly sourceRange: SourceRange;
    readonly severity: Severity;
    readonly code: string;
    readonly parsedDocument: ParsedDocument;
}
export declare class Warning {
    readonly code: string;
    readonly message: string;
    readonly sourceRange: SourceRange;
    readonly severity: Severity;
    private readonly _parsedDocument;
    constructor(init: WarningInit);
    toString(options?: Partial<WarningStringifyOptions>): string;
    private _severityToColorFunction(severity);
    private _severityToString(colorize);
    toJSON(): {
        code: string;
        message: string;
        severity: Severity;
        sourceRange: SourceRange;
    };
}
export declare enum Severity {
    ERROR = 0,
    WARNING = 1,
    INFO = 2,
}
export declare class WarningCarryingException extends Error {
    readonly warning: Warning;
    constructor(warning: Warning);
}
export declare type Verbosity = 'one-line' | 'full' | 'code-only';
export interface WarningStringifyOptions {
    readonly verbosity: Verbosity;
    readonly color: boolean;
}
