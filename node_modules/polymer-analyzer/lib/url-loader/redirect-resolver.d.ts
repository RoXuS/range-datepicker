/**
 * @license
 * Copyright (c) 2016 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
import { UrlResolver } from './url-resolver';
/**
 * Resolves a URL having one prefix to another URL with a different prefix.
 */
export declare class RedirectResolver implements UrlResolver {
    private _redirectFrom;
    private _redirectTo;
    constructor(_redirectFrom: string, _redirectTo: string);
    canResolve(url: string): boolean;
    resolve(url: string): string;
}
