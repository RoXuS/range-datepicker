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
const package_url_resolver_1 = require("../../url-loader/package-url-resolver");
suite('PackageUrlResolver', function () {
    suite('canResolve', () => {
        test('is true an in-package URL', () => {
            const r = new package_url_resolver_1.PackageUrlResolver();
            chai_1.assert.isTrue(r.canResolve('foo.html'));
            chai_1.assert.isTrue(r.canResolve('/foo.html'));
            chai_1.assert.isTrue(r.canResolve('./foo.html'));
        });
        test('is true for a sibling URL', () => {
            chai_1.assert.isTrue(new package_url_resolver_1.PackageUrlResolver().canResolve('../foo/foo.html'));
        });
        test('is false for a cousin URL', () => {
            chai_1.assert.isFalse(new package_url_resolver_1.PackageUrlResolver().canResolve('../../foo/foo.html'));
        });
        test('is false for URL with a hostname', () => {
            const r = new package_url_resolver_1.PackageUrlResolver();
            chai_1.assert.isFalse(r.canResolve('http://abc.xyz/foo.html'));
            chai_1.assert.isFalse(r.canResolve('//abc.xyz/foo.html'));
        });
        test('is true for a URL with the right hostname', () => {
            const r = new package_url_resolver_1.PackageUrlResolver({
                hostname: 'abc.xyz',
            });
            chai_1.assert.isTrue(r.canResolve('http://abc.xyz/foo.html'));
            chai_1.assert.isTrue(r.canResolve('http://abc.xyz/./foo.html'));
            chai_1.assert.isTrue(r.canResolve('http://abc.xyz/../foo.html'));
            chai_1.assert.isTrue(r.canResolve('http://abc.xyz/foo/../foo.html'));
            chai_1.assert.isTrue(r.canResolve('//abc.xyz/foo.html'));
        });
        test('is false for an undecodable URL', () => {
            const r = new package_url_resolver_1.PackageUrlResolver();
            chai_1.assert.isFalse(r.canResolve('%><><%='));
        });
    });
    suite('resolve', () => {
        test('resolves an in-package URL', () => {
            const r = new package_url_resolver_1.PackageUrlResolver();
            chai_1.assert.equal('foo.html', r.resolve('foo.html'));
            chai_1.assert.equal('foo.html', r.resolve('/foo.html'));
            chai_1.assert.equal('foo.html', r.resolve('./foo.html'));
        });
        test('resolves a sibling URL', () => {
            chai_1.assert.equal('bower_components/foo/foo.html', new package_url_resolver_1.PackageUrlResolver().resolve('../foo/foo.html'));
        });
        test('throws for a cousin URL', () => {
            chai_1.assert.throws(() => new package_url_resolver_1.PackageUrlResolver().resolve('../../foo/foo.html'));
        });
        test('throws for a URL with a hostname', () => {
            chai_1.assert.throws(() => new package_url_resolver_1.PackageUrlResolver().resolve('http://abc.xyz/foo.html'));
        });
        test('resolves a URL with the right hostname', () => {
            const r = new package_url_resolver_1.PackageUrlResolver({
                componentDir: 'components',
                hostname: 'abc.xyz',
            });
            chai_1.assert.equal('foo.html', r.resolve('http://abc.xyz/foo.html'));
            chai_1.assert.equal('foo.html', r.resolve('http://abc.xyz/./foo.html'));
            chai_1.assert.equal('foo.html', r.resolve('http://abc.xyz/../foo.html'));
            chai_1.assert.equal('foo.html', r.resolve('http://abc.xyz/foo/../foo.html'));
            chai_1.assert.equal('foo.html', r.resolve('foo.html'));
            chai_1.assert.equal('foo.html', r.resolve('./foo.html'));
            chai_1.assert.equal('components/foo/foo.html', r.resolve('../foo/foo.html'));
            chai_1.assert.equal('foo.html', r.resolve('foo/../foo.html'));
            chai_1.assert.equal('foo.html', r.resolve('/foo.html'));
            chai_1.assert.equal('foo.html', r.resolve('/./foo.html'));
            chai_1.assert.equal('foo/foo.html', r.resolve('/../foo/foo.html'));
            chai_1.assert.equal('foo.html', r.resolve('/foo/../foo.html'));
        });
        test('resolves a URL with spaces', () => {
            const r = new package_url_resolver_1.PackageUrlResolver();
            chai_1.assert.equal(r.resolve('spaced name.html'), 'spaced%20name.html');
        });
    });
});

//# sourceMappingURL=package-url-resolver_test.js.map
