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
const scan_1 = require("../../scanning/scan");
const test_utils_1 = require("../test-utils");
suite('scan()', () => {
    test('calls Scanner.scan', () => __awaiter(this, void 0, void 0, function* () {
        const feature = Symbol('feature');
        const scanner = new ScannerStub([feature]);
        const document = makeTestDocument({});
        const { features } = yield scan_1.scan(document, [scanner]);
        chai_1.assert.deepEqual(features, [feature]);
        chai_1.assert.deepEqual(scanner.calls, [{ document }]);
        chai_1.assert.deepEqual(features, [feature]);
    }));
    test('supports multiple and async calls to visit()', () => __awaiter(this, void 0, void 0, function* () {
        const visitor1 = Symbol('visitor1');
        const visitor2 = Symbol('visitor2');
        const visitor3 = Symbol('visitor3');
        const scanner = {
            scan(_, visit) {
                return __awaiter(this, void 0, void 0, function* () {
                    // two visitors in one batch
                    yield Promise.all([visit(visitor1), visit(visitor2)]);
                    // one visitor in a subsequent batch, delayed a turn to make sure
                    // we can call visit() truly async
                    yield new Promise((resolve, _reject) => {
                        setTimeout(() => {
                            visit(visitor3).then(resolve);
                        }, 0);
                    });
                    return { features: [`a feature`], warnings: [] };
                });
            },
        };
        const visitedVisitors = [];
        const document = makeTestDocument({
            visit(visitors) {
                return __awaiter(this, void 0, void 0, function* () {
                    visitedVisitors.push.apply(visitedVisitors, visitors);
                });
            }
        });
        const { features } = yield scan_1.scan(document, [scanner]);
        chai_1.assert.deepEqual([`a feature`], features);
        chai_1.assert.deepEqual(visitedVisitors, [visitor1, visitor2, visitor3]);
    }));
    test('propagates exceptions in scanners', () => {
        const scanner = {
            scan(_doc, _visit) {
                throw new Error('expected');
            },
        };
        return test_utils_1.invertPromise(scan_1.scan(makeTestDocument({}), [scanner]));
    });
    test('propagates exceptions in visitors', () => {
        const document = makeTestDocument({
            visit: () => {
                throw new Error('expected');
            },
        });
        return test_utils_1.invertPromise(scan_1.scan(document, [makeTestScanner({})]));
    });
});
function makeTestDocument(options) {
    return {
        type: options.type || 'test-type',
        contents: options.contents || 'test-contents',
        ast: options.ast || 'test-ast',
        url: options.url || 'test-url',
        visit: options.visit || (() => null),
        forEachNode: options.forEachNode || (() => null),
        sourceRangeForNode: () => {
            throw new Error('not implemented in test doc');
        },
        stringify() {
            return 'test stringify output';
        }
    };
}
function makeTestScanner(options) {
    const simpleScan = ((_doc, visit) => __awaiter(this, void 0, void 0, function* () {
        yield visit();
        return { features: ['test-feature'], warnings: [] };
    }));
    return { scan: options.scan || simpleScan };
}
/**
 * Scanner that always returns the given features and tracks when
 * scan is called.
 */
class ScannerStub {
    constructor(features) {
        this.features = features;
        this.calls = [];
    }
    scan(document, _visit) {
        return __awaiter(this, void 0, void 0, function* () {
            this.calls.push({ document });
            return { features: this.features, warnings: [] };
        });
    }
}

//# sourceMappingURL=scan_test.js.map
