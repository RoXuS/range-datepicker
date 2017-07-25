/// <reference types="vinyl" />
import { AsyncTransformStream } from './streams';
import File = require('vinyl');
/**
 * When compiling to ES5 we need to inject Babel's helpers into a global so
 * that they don't need to be included with each compiled file.
 */
export declare class BabelHelpersInjector extends AsyncTransformStream<File, File> {
    private entrypoint;
    constructor(entrypoint: string);
    protected _transformIter(files: AsyncIterable<File>): AsyncIterableIterator<File>;
    private processFile(file);
}
