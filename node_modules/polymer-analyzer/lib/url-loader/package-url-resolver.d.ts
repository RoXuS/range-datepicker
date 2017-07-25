/// <reference types="node" />
import { Url } from 'url';
import { UrlResolver } from './url-resolver';
export interface PackageUrlResolverOptions {
    componentDir?: string;
    hostname?: string;
}
/**
 * Resolves a URL to a canonical URL within a package.
 */
export declare class PackageUrlResolver implements UrlResolver {
    componentDir: string;
    hostname: string | null;
    constructor(options?: PackageUrlResolverOptions);
    canResolve(url: string): boolean;
    _isValid(urlObject: Url, pathname: string): boolean;
    resolve(url: string): string;
}
