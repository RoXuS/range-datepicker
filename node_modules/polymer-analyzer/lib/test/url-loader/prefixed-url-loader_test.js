"use strict";
/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const prefixed_url_loader_1 = require("../../url-loader/prefixed-url-loader");
const test_utils_1 = require("../test-utils");
class MockLoader {
    constructor(_load) {
        this._load = _load;
        this.reset();
    }
    reset() {
        this.canLoadUrls = [];
        this.loadUrls = [];
    }
    canLoad(url) {
        this.canLoadUrls.push(url);
        return this._load != null;
    }
    load(url) {
        return __awaiter(this, void 0, void 0, function* () {
            this.loadUrls.push(url);
            if (this._load == null) {
                throw new Error(`Tried to load "${url}", and delegate can't load it.`);
            }
            return this._load;
        });
    }
}
suite('PrefixedUrlLoader', () => {
    suite('canLoad', () => {
        test('canLoad is true if the url starts with prefix', () => {
            const delegate = new MockLoader('stuff');
            const loader = new prefixed_url_loader_1.PrefixedUrlLoader('path/to/stuff/', delegate);
            chai_1.assert.isTrue(loader.canLoad('path/to/stuff/file.html'));
            // Delegate receives an unprefixed url to check.
            chai_1.assert.deepEqual(delegate.canLoadUrls, ['file.html']);
        });
        test('canLoad is false if the url does not start with prefix', () => {
            const delegate = new MockLoader('stuff');
            const loader = new prefixed_url_loader_1.PrefixedUrlLoader('path/to/stuff/', delegate);
            chai_1.assert.isFalse(loader.canLoad('path/to/other/file.html'));
            // Delegate is not consulted.
            chai_1.assert.deepEqual(delegate.canLoadUrls, []);
        });
        test('canLoad is false if the delgate loader says it is', () => {
            const delegate = new MockLoader(null);
            const loader = new prefixed_url_loader_1.PrefixedUrlLoader('path/to/stuff/', delegate);
            chai_1.assert.isFalse(loader.canLoad('path/to/stuff/file.html'));
            // Delegate receives an unprefixed url to check.
            chai_1.assert.deepEqual(delegate.canLoadUrls, ['file.html']);
        });
    });
    suite('load', () => {
        test('load returns content if url starts with prefix', () => __awaiter(this, void 0, void 0, function* () {
            const delegate = new MockLoader('stuff');
            const loader = new prefixed_url_loader_1.PrefixedUrlLoader('path/to/stuff/', delegate);
            chai_1.assert.deepEqual(yield loader.load('path/to/stuff/file.html'), 'stuff');
            // Delegate receives an unprefixed url to load.
            chai_1.assert.deepEqual(delegate.loadUrls, ['file.html']);
        }));
        test('load throws error if url does not start with prefix', () => __awaiter(this, void 0, void 0, function* () {
            const delegate = new MockLoader('stuff');
            const loader = new prefixed_url_loader_1.PrefixedUrlLoader('path/to/stuff/', delegate);
            const error = yield test_utils_1.invertPromise(loader.load('path/to/other/file.html'));
            chai_1.assert.instanceOf(error, Error);
            chai_1.assert.deepEqual(error.message, 'Can not load "path/to/other/file.html", does not match prefix "path/to/stuff/".');
            // Delegate is not consulted.
            chai_1.assert.deepEqual(delegate.loadUrls, []);
        }));
        test('load passes on delegate error if url starts with prefix', () => __awaiter(this, void 0, void 0, function* () {
            const delegate = new MockLoader(null);
            const loader = new prefixed_url_loader_1.PrefixedUrlLoader('path/to/stuff/', delegate);
            const error = yield test_utils_1.invertPromise(loader.load('path/to/stuff/file.html'));
            chai_1.assert.instanceOf(error, Error);
            chai_1.assert.deepEqual(error.message, 'Tried to load "file.html", and delegate can\'t load it.');
            // Delegate was asked.
            chai_1.assert.deepEqual(delegate.loadUrls, ['file.html']);
        }));
    });
});

//# sourceMappingURL=prefixed-url-loader_test.js.map
