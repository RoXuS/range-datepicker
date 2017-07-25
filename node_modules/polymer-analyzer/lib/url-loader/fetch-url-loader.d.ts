import { UrlLoader } from './url-loader';
/**
 * Resolves requests via the the DOM fetch API.
 */
export declare class FetchUrlLoader implements UrlLoader {
    baseUrl: string;
    constructor(baseUrl: string);
    _resolve(url: string): string;
    canLoad(_: string): boolean;
    load(url: string): Promise<string>;
}
