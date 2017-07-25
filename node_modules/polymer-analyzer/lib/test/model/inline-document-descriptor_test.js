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
const model_1 = require("../../model/model");
suite('correctSourceRange', function () {
    test('handles undefined gracefully', function () {
        const zeroPosition = { line: 0, column: 0 };
        const zeroSourceRange = { file: 'foo', start: zeroPosition, end: zeroPosition };
        const zeroLocationOffset = { line: 0, col: 0 };
        chai_1.assert.equal(model_1.correctSourceRange(undefined, undefined), undefined);
        chai_1.assert.equal(model_1.correctSourceRange(undefined, zeroLocationOffset), undefined);
        chai_1.assert.deepEqual(model_1.correctSourceRange(zeroSourceRange, undefined), zeroSourceRange);
    });
    test('handles source locations on the first line', function () {
        chai_1.assert.deepEqual(model_1.correctPosition({ line: 0, column: 1 }, { line: 1, col: 1 }), { line: 1, column: 2 });
    });
    test('does not change column offsets for ' +
        'source locations after the first', function () {
        chai_1.assert.deepEqual(model_1.correctPosition({ line: 1, column: 1 }, { line: 1, col: 1 }), { line: 2, column: 1 });
    });
    test('does not modify its input', function () {
        const input = { line: 5, column: 5 };
        const offset = { line: 5, col: 5 };
        const expected = { line: 10, column: 5 };
        chai_1.assert.deepEqual(model_1.correctPosition(input, offset), expected);
        chai_1.assert.deepEqual(input, { line: 5, column: 5 });
    });
});

//# sourceMappingURL=inline-document-descriptor_test.js.map
