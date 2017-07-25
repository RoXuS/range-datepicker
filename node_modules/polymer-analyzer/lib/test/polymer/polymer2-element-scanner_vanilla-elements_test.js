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
const chai = require("chai");
const chai_1 = require("chai");
const fs = require("fs");
const path = require("path");
const class_scanner_1 = require("../../javascript/class-scanner");
const javascript_parser_1 = require("../../javascript/javascript-parser");
const polymer_element_1 = require("../../polymer/polymer-element");
//
// NOTE: THis test was copied from
// /src/test/vanilla-custom-elements/element-scanner_test.js
// to ensure that Polymer2ElementScanner can scan vanilla elements while we
// disable the vanilla element scanner for a short time.
//
// Do not modify this test any more, so that we don't have to sync changes
//
chai.use(require('chai-subset'));
suite('Polymer2ElementScanner - Vanilla Element Scanning', () => {
    const elements = new Map();
    let document;
    let elementsList;
    suiteSetup(() => __awaiter(this, void 0, void 0, function* () {
        const parser = new javascript_parser_1.JavaScriptParser();
        const file = fs.readFileSync(path.resolve(__dirname, '../static/vanilla-elements.js'), 'utf8');
        document = parser.parse(file, '/static/vanilla-elements.js');
        const scanner = new class_scanner_1.ClassScanner();
        const visit = (visitor) => Promise.resolve(document.visit([visitor]));
        const { features } = yield scanner.scan(document, visit);
        elementsList = features.filter((e) => e instanceof polymer_element_1.ScannedPolymerElement);
        for (const element of elementsList) {
            elements.set(element.tagName, element);
        }
    }));
    test('Finds elements', () => {
        chai_1.assert.deepEqual(elementsList.map((e) => e.tagName).sort(), [
            'anonymous-class',
            'class-declaration',
            'class-expression',
            'vanilla-with-observed-attributes',
            'register-before-declaration',
            'register-before-expression'
        ].sort());
        chai_1.assert.deepEqual(elementsList.map((e) => e.className).sort(), [
            undefined,
            'ClassDeclaration',
            'ClassExpression',
            'WithObservedAttributes',
            'RegisterBeforeDeclaration',
            'RegisterBeforeExpression'
        ].sort());
        chai_1.assert.deepEqual(elementsList.map((e) => e.superClass && e.superClass.identifier).sort(), [
            'HTMLElement',
            'HTMLElement',
            'HTMLElement',
            'HTMLElement',
            'HTMLElement',
            'HTMLElement',
        ].sort());
    });
    test('Extracts attributes from observedAttributes', () => {
        const element = elements.get('vanilla-with-observed-attributes');
        chai_1.assert.containSubset(Array.from(element.attributes.values()), [
            {
                description: 'When given the element is totally inactive',
                name: 'disabled',
                type: 'boolean',
                sourceRange: {
                    file: '/static/vanilla-elements.js',
                    start: { column: 6, line: 25 },
                    end: { column: 16, line: 25 }
                }
            },
            {
                description: 'When given the element is expanded',
                name: 'open',
                type: 'boolean',
                sourceRange: {
                    file: '/static/vanilla-elements.js',
                    start: { column: 6, line: 27 },
                    end: { column: 12, line: 27 }
                }
            },
            {
                description: '',
                name: 'foo',
                sourceRange: {
                    file: '/static/vanilla-elements.js',
                    start: { column: 14, line: 27 },
                    end: { column: 19, line: 27 }
                },
            },
            {
                description: '',
                name: 'bar',
                sourceRange: {
                    file: '/static/vanilla-elements.js',
                    start: { column: 21, line: 27 },
                    end: { column: 26, line: 27 }
                },
            }
        ]);
    });
    test('Extracts description from jsdoc', () => {
        const element = elements.get('vanilla-with-observed-attributes');
        chai_1.assert.equal(element.description, 'This is a description of WithObservedAttributes.');
    });
});

//# sourceMappingURL=polymer2-element-scanner_vanilla-elements_test.js.map
