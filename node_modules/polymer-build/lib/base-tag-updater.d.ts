/// <reference types="vinyl" />
import File = require('vinyl');
import { AsyncTransformStream } from './streams';
/**
 * Find a `<base>` tag in the specified file and if found, update its `href`
 * with the given new value.
 */
export declare class BaseTagUpdater extends AsyncTransformStream<File, File> {
    private filePath;
    private newHref;
    constructor(filePath: string, newHref: string);
    protected _transformIter(files: AsyncIterable<File>): AsyncIterable<File>;
}
