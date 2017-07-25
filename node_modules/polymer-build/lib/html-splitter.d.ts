/// <reference types="node" />
/// <reference types="vinyl" />
import { Transform } from 'stream';
import File = require('vinyl');
/**
 * HTMLSplitter represents the shared state of files as they are passed through
 * a splitting stream and then a rejoining stream. Creating a new instance of
 * HTMLSplitter and adding its streams to the build pipeline is the
 * supported user interface for splitting out and rejoining inlined CSS & JS in
 * the build process.
 */
export declare class HtmlSplitter {
    private _splitFiles;
    private _parts;
    /**
     * Returns a new `Transform` stream that splits inline script and styles into
     * new, separate files that are passed out of the stream.
     */
    split(): Transform;
    /**
     * Returns a new `Transform` stream that rejoins inline scripts and styles
     * that were originally split from this `HTMLSplitter`'s `split()` back into
     * their parent HTML files.
     */
    rejoin(): Transform;
    isSplitFile(parentPath: string): boolean;
    getSplitFile(parentPath: string): SplitFile;
    addSplitPath(parentPath: string, childPath: string): void;
    getParentFile(childPath: string): SplitFile;
}
/**
 * Represents a file that is split into multiple files.
 */
export declare class SplitFile {
    path: string;
    parts: Map<string, string>;
    outstandingPartCount: number;
    vinylFile: File;
    constructor(path: string);
    addPartPath(path: string): void;
    setPartContent(path: string, content: string): void;
    readonly isComplete: boolean;
}
