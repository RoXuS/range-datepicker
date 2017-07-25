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
const multi_url_loader_1 = require("../../url-loader/multi-url-loader");
const test_utils_1 = require("../test-utils");
class MockLoader {
    constructor(_load) {
        this._load = _load;
        this.resetCounts();
    }
    resetCounts() {
        this.canLoadCount = 0;
        this.loadCount = 0;
    }
    canLoad(_url) {
        this.canLoadCount++;
        return this._load != null;
    }
    load(url) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._load == null) {
                throw new Error(`tried to load ${url} with loader that can\'t load`);
            }
            this.loadCount++;
            return this._load;
        });
    }
}
const mockLoaderArray = (loads) => loads.map((load) => new MockLoader(load));
suite('MultiUrlLoader', () => {
    suite('canLoad', () => {
        test('canLoad is true if the first loader is true', () => {
            const loaders = mockLoaderArray(['loader 1', null, null]);
            const loader = new multi_url_loader_1.MultiUrlLoader(loaders);
            chai_1.assert.isTrue(loader.canLoad('test.html'));
            // Verify only the first loader is called
            chai_1.assert.equal(loaders[0].canLoadCount, 1);
            chai_1.assert.equal(loaders[1].canLoadCount, 0);
            chai_1.assert.equal(loaders[2].canLoadCount, 0);
        });
        test('canLoad is true if the last loader is true', () => {
            const loaders = mockLoaderArray([null, null, 'loader 3']);
            const loader = new multi_url_loader_1.MultiUrlLoader(loaders);
            chai_1.assert.isTrue(loader.canLoad('test.html'));
            // Verify all loaders are called
            chai_1.assert.equal(loaders[0].canLoadCount, 1);
            chai_1.assert.equal(loaders[1].canLoadCount, 1);
            chai_1.assert.equal(loaders[2].canLoadCount, 1);
        });
        test('canLoad is true if all loaders are true', () => {
            const loaders = mockLoaderArray(['loader 1', 'loader 2', 'loader 3']);
            const loader = new multi_url_loader_1.MultiUrlLoader(loaders);
            chai_1.assert.isTrue(loader.canLoad('test.html'));
            // Verify only the first loader is called
            chai_1.assert.equal(loaders[0].canLoadCount, 1);
            chai_1.assert.equal(loaders[1].canLoadCount, 0);
            chai_1.assert.equal(loaders[2].canLoadCount, 0);
        });
        test('canLoad is false if all loaders are false', () => {
            const loaders = mockLoaderArray([null, null, null]);
            const loader = new multi_url_loader_1.MultiUrlLoader(loaders);
            chai_1.assert.isFalse(loader.canLoad('test.html'));
            // Verify only the first loader is called
            chai_1.assert.equal(loaders[0].canLoadCount, 1);
            chai_1.assert.equal(loaders[1].canLoadCount, 1);
            chai_1.assert.equal(loaders[2].canLoadCount, 1);
        });
    });
    suite('load', () => {
        test('returns only the first loaded file', () => __awaiter(this, void 0, void 0, function* () {
            const loaders = mockLoaderArray(['loader 1', 'loader 2', 'loader 3']);
            const loader = new multi_url_loader_1.MultiUrlLoader(loaders);
            chai_1.assert.equal(yield loader.load('test.html'), 'loader 1');
            // Verify only the first loader is called
            chai_1.assert.equal(loaders[0].canLoadCount, 1);
            chai_1.assert.equal(loaders[1].canLoadCount, 0);
            chai_1.assert.equal(loaders[2].canLoadCount, 0);
        }));
        test('returns the file from first loader that can load', () => __awaiter(this, void 0, void 0, function* () {
            const loaders = mockLoaderArray([null, null, 'loader 3']);
            const loader = new multi_url_loader_1.MultiUrlLoader(loaders);
            chai_1.assert.equal(yield loader.load('test.html'), 'loader 3');
            // Verify only the last load is called
            chai_1.assert.equal(loaders[0].loadCount, 0);
            chai_1.assert.equal(loaders[1].loadCount, 0);
            chai_1.assert.equal(loaders[2].loadCount, 1);
        }));
        test('throws an error if no loader can be found to load', () => __awaiter(this, void 0, void 0, function* () {
            const loaders = mockLoaderArray([null, null, null]);
            const loader = new multi_url_loader_1.MultiUrlLoader(loaders);
            const error = yield test_utils_1.invertPromise(loader.load('test.html'));
            chai_1.assert.instanceOf(error, Error);
            chai_1.assert.include(error.message, 'Unable to load test.html');
            // Verify load is not called on any loader
            chai_1.assert.equal(loaders[0].loadCount, 0);
            chai_1.assert.equal(loaders[1].loadCount, 0);
            chai_1.assert.equal(loaders[2].loadCount, 0);
        }));
    });
});

//# sourceMappingURL=multi-url-loader_test.js.map
