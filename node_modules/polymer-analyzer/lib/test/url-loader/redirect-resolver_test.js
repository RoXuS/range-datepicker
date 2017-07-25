"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const redirect_resolver_1 = require("../../url-loader/redirect-resolver");
suite('RedirectResolver', function () {
    suite('canResolve', () => {
        test('canResolve is true if the prefix matches with protocol', () => {
            const resolver = new redirect_resolver_1.RedirectResolver('proto://site/', 'some/path');
            chai_1.assert.isTrue(resolver.canResolve('proto://site/something.html'));
        });
        test('canResolve is true if the prefix matches without protocol', () => {
            const resolver = new redirect_resolver_1.RedirectResolver('/site/', 'some/path');
            chai_1.assert.isTrue(resolver.canResolve('/site/something.html'));
        });
        test('canResolve is false if the prefix doesn\'t match', () => {
            const resolver = new redirect_resolver_1.RedirectResolver('proto://site/', 'some/path');
            chai_1.assert.isFalse(resolver.canResolve('/site/something.html'));
            chai_1.assert.isFalse(resolver.canResolve('protzo://site/something.html'));
        });
    });
    suite('resolve', () => {
        test('if prefix matches, url is rewritten', () => {
            const resolver = new redirect_resolver_1.RedirectResolver('proto://site/', 'some/path/');
            chai_1.assert.equal(resolver.resolve('proto://site/something.html'), 'some/path/something.html');
        });
        test('if prefix doesn\'t match, resolve throws', () => {
            const resolver = new redirect_resolver_1.RedirectResolver('proto://site/', 'some/path/');
            chai_1.assert.throws(() => resolver.resolve('protoz://site/something.html'), /RedirectResolver/);
        });
    });
});

//# sourceMappingURL=redirect-resolver_test.js.map
