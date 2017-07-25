/// <reference types="vinyl" />
import { ProjectConfig } from 'polymer-project-config';
import File = require('vinyl');
import { AsyncTransformStream } from './streams';
/**
 * A stream that modifies HTML files to include prefetch links for all of the
 * file's transitive dependencies.
 */
export declare class AddPrefetchLinks extends AsyncTransformStream<File, File> {
    files: Map<string, File>;
    private _analyzer;
    private _config;
    constructor(config: ProjectConfig);
    protected _transformIter(files: AsyncIterable<File>): AsyncIterable<File>;
}
/**
 * Returns the given HTML updated with import or prefetch links for the given
 * dependencies. The given url and deps are expected to be project-relative
 * URLs (e.g. "index.html" or "src/view.html") unless absolute parameter is
 * `true` and there is no base tag in the document.
 */
export declare function createLinks(html: string, baseUrl: string, deps: Set<string>, absolute?: boolean): string;
