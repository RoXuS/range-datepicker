"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @license
 * Copyright (c) 2015 The Polymer Project Authors. All rights reserved.
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
const chai_1 = require("chai");
const document_1 = require("../../parser/document");
class TestDocument extends document_1.ParsedDocument {
    visit(_visitors) {
        throw new Error('Method not implemented.');
    }
    forEachNode(_callback) {
        throw new Error('Method not implemented.');
    }
    _sourceRangeForNode(_node) {
        throw new Error('Method not implemented.');
    }
    stringify(_options) {
        throw new Error('Method not implemented.');
    }
    constructor(contents) {
        super({
            ast: null,
            astNode: null,
            baseUrl: 'test-document', contents,
            isInline: false,
            locationOffset: undefined,
            url: 'test-document'
        });
    }
}
suite('ParsedDocument', () => {
    /**
     * We have pretty great tests of offsetsToSourceRange just because it's used
     * so much in ParsedHtmlDocument, which has tons of tests. So we can get good
     * tests of sourceRangeToOffsets by ensuring that they're inverses of one
     * another.
     */
    const testName = 'offsetsToSourceRange is the inverse of sourceRangeToOffsets for ' +
        'in-bounds ranges';
    test(testName, () => __awaiter(this, void 0, void 0, function* () {
        const contents = [``, `asdf`, `a\na`, `asdf\n\nasdf`, `\nasdf\n`];
        for (const content of contents) {
            const document = new TestDocument(content);
            for (let start = 0; start < content.length; start++) {
                for (let end = start; end < content.length; end++) {
                    const range = document.offsetsToSourceRange(start, end);
                    const offsets = document.sourceRangeToOffsets(range);
                    chai_1.assert.deepEqual(offsets, [start, end]);
                }
            }
        }
    }));
    test('sourcePositionToOffsets clamps out of bounds values', () => __awaiter(this, void 0, void 0, function* () {
        const document = new TestDocument(`abc\ndef`);
        chai_1.assert.deepEqual(document.sourcePositionToOffset({ line: 0, column: -1 }), 0);
        chai_1.assert.deepEqual(document.sourcePositionToOffset({ line: 1, column: -10 }), 0);
        chai_1.assert.deepEqual(document.sourcePositionToOffset({ line: 5, column: 0 }), 7);
        chai_1.assert.deepEqual(document.sourcePositionToOffset({ line: 1, column: 12 }), 7);
    }));
    test('sourceRangeToOffsets works for simple cases', () => __awaiter(this, void 0, void 0, function* () {
        let document = new TestDocument('ab');
        chai_1.assert.deepEqual(document.offsetToSourcePosition(0), { line: 0, column: 0 });
        chai_1.assert.deepEqual(document.offsetToSourcePosition(1), { line: 0, column: 1 });
        chai_1.assert.deepEqual(document.offsetToSourcePosition(2), { line: 0, column: 2 });
        document = new TestDocument('\n\n');
        chai_1.assert.deepEqual(document.offsetToSourcePosition(0), { line: 0, column: 0 });
        chai_1.assert.deepEqual(document.offsetToSourcePosition(1), { line: 1, column: 0 });
        chai_1.assert.deepEqual(document.offsetToSourcePosition(2), { line: 2, column: 0 });
        document = new TestDocument('a\nb\nc');
        chai_1.assert.deepEqual(document.offsetToSourcePosition(0), { line: 0, column: 0 });
        chai_1.assert.deepEqual(document.offsetToSourcePosition(1), { line: 0, column: 1 });
        chai_1.assert.deepEqual(document.offsetToSourcePosition(2), { line: 1, column: 0 });
        chai_1.assert.deepEqual(document.offsetToSourcePosition(3), { line: 1, column: 1 });
        chai_1.assert.deepEqual(document.offsetToSourcePosition(4), { line: 2, column: 0 });
        chai_1.assert.deepEqual(document.offsetToSourcePosition(5), { line: 2, column: 1 });
    }));
    test('sourceRangeToOffsets fails gracefully', () => __awaiter(this, void 0, void 0, function* () {
        let document = new TestDocument('ab');
        chai_1.assert.deepEqual(document.offsetToSourcePosition(-1), { line: 0, column: -1 });
        chai_1.assert.deepEqual(document.offsetToSourcePosition(3), { line: 0, column: 3 });
        chai_1.assert.deepEqual(document.offsetToSourcePosition(4), { line: 0, column: 4 });
        document = new TestDocument('\n\n');
        chai_1.assert.deepEqual(document.offsetToSourcePosition(-1), { line: 0, column: -1 });
        chai_1.assert.deepEqual(document.offsetToSourcePosition(3), { line: 2, column: 1 });
        chai_1.assert.deepEqual(document.offsetToSourcePosition(4), { line: 2, column: 2 });
    }));
});

//# sourceMappingURL=document_test.js.map
