import { UrlLoader } from './url-loader';
/**
 * Resolves requests via the file system.
 */
export declare class FSUrlLoader implements UrlLoader {
    root: string;
    constructor(root?: string);
    canLoad(url: string): boolean;
    private _isValid(urlObject, pathname);
    load(url: string): Promise<string>;
    getFilePath(url: string): string;
    readDirectory(pathFromRoot: string, deep?: boolean): Promise<string[]>;
}
