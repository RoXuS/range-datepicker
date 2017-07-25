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
const fs_url_loader_1 = require("../../url-loader/fs-url-loader");
suite('FSUrlLoader', function () {
    suite('canLoad', () => {
        test('canLoad is true an in-package URL', () => {
            chai_1.assert.isTrue(new fs_url_loader_1.FSUrlLoader('').canLoad('foo.html'));
        });
        test('canLoad is false for a sibling URL', () => {
            chai_1.assert.isFalse(new fs_url_loader_1.FSUrlLoader('').canLoad('../foo/foo.html'));
        });
        test('canLoad is false for a cousin URL', () => {
            chai_1.assert.isFalse(new fs_url_loader_1.FSUrlLoader('').canLoad('../../foo/foo.html'));
        });
        test('canLoad is false for URL with a hostname', () => {
            chai_1.assert.isFalse(new fs_url_loader_1.FSUrlLoader('').canLoad('http://abc.xyz/foo.html'));
        });
    });
    suite('getFilePath', () => {
        test('resolves an in-package URL', () => {
            chai_1.assert.equal(new fs_url_loader_1.FSUrlLoader('').getFilePath('foo.html'), 'foo.html');
        });
        test('resolves an in-package URL', () => {
            chai_1.assert.equal(new fs_url_loader_1.FSUrlLoader('root').getFilePath('foo.html'), 'root/foo.html');
        });
        test('throws for a sibling URL', () => {
            chai_1.assert.throws(() => new fs_url_loader_1.FSUrlLoader('').getFilePath('../foo/foo.html'));
        });
        test('throws for a cousin URL', () => {
            chai_1.assert.throws(() => new fs_url_loader_1.FSUrlLoader('').getFilePath('../../foo/foo.html'));
        });
        test('throws for a URL with a hostname', () => {
            chai_1.assert.throws(() => new fs_url_loader_1.FSUrlLoader('').getFilePath('http://abc.xyz/foo.html'));
        });
    });
});

//# sourceMappingURL=fs-url-loader_test.js.map
