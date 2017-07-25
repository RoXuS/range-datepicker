/// <reference types="node" />
/// <reference types="vinyl" />
import { Transform } from 'stream';
import File = require('vinyl');
/**
 * Waits for the given ReadableStream
 */
export declare function waitFor(stream: NodeJS.ReadableStream): Promise<NodeJS.ReadableStream>;
/**
 * Waits for all the given ReadableStreams
 */
export declare function waitForAll(streams: NodeJS.ReadableStream[]): Promise<NodeJS.ReadableStream[]>;
/**
 * Returns the string contents of a Vinyl File object, waiting for
 * all chunks if the File is a stream.
 */
export declare function getFileContents(file: File): Promise<string>;
/**
 * Composes multiple streams (or Transforms) into one.
 */
export declare function compose(streams: NodeJS.ReadWriteStream[]): any;
/**
 * Implements `stream.Transform` via standard async iteration.
 *
 * The main advantage over implementing stream.Transform itself is that correct
 * error handling is built in and easy to get right, simply by using
 * async/await.
 *
 * `In` and `Out` extend `{}` because they may not be `null`.
 */
export declare abstract class AsyncTransformStream<In extends {}, Out extends {}> extends Transform {
    private readonly _inputs;
    /**
     * Implement this method!
     *
     * Read from the given iterator to consume input, yield values to write
     * chunks of your own. You may yield any number of values for each input.
     *
     * Note: currently you *must* completely consume `inputs` and return for this
     *   stream to close.
     */
    protected abstract _transformIter(inputs: AsyncIterable<In>): AsyncIterable<Out>;
    private _initialized;
    private _writingFinished;
    private _initializeOnce();
    /**
     * Don't override.
     *
     * Passes input into this._inputs.
     */
    _transform(input: In, _encoding: string, callback: (error?: any, value?: Out) => void): void;
    /**
     * Don't override.
     *
     * Finish writing out the outputs.
     */
    protected _flush(callback: (err?: any) => void): Promise<void>;
}
/**
 * A stream that takes file path strings, and outputs full Vinyl file objects
 * for the file at each location.
 */
export declare class VinylReaderTransform extends AsyncTransformStream<string, File> {
    constructor();
    protected _transformIter(paths: AsyncIterable<string>): AsyncIterable<File>;
}
