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
const path = require("path");
const function_1 = require("../../javascript/function");
const function_scanner_1 = require("../../javascript/function-scanner");
const javascript_parser_1 = require("../../javascript/javascript-parser");
const fs_url_loader_1 = require("../../url-loader/fs-url-loader");
const test_utils_1 = require("../test-utils");
suite('FunctionScanner', () => {
    const testFilesDir = path.resolve(__dirname, '../static/namespaces/');
    const urlLoader = new fs_url_loader_1.FSUrlLoader(testFilesDir);
    const underliner = new test_utils_1.CodeUnderliner(urlLoader);
    function getNamespaceFunctions(filename) {
        return __awaiter(this, void 0, void 0, function* () {
            const file = yield urlLoader.load(filename);
            const parser = new javascript_parser_1.JavaScriptParser();
            const document = parser.parse(file, filename);
            const scanner = new function_scanner_1.FunctionScanner();
            const visit = (visitor) => Promise.resolve(document.visit([visitor]));
            const { features } = yield scanner.scan(document, visit);
            return features.filter((e) => e instanceof function_1.ScannedFunction);
        });
    }
    ;
    function getTestProps(fn) {
        return __awaiter(this, void 0, void 0, function* () {
            return {
                name: fn.name,
                description: fn.description,
                summary: fn.summary,
                warnings: fn.warnings,
                params: fn.params, return: fn.return,
                codeSnippet: yield underliner.underline(fn.sourceRange),
                privacy: fn.privacy
            };
        });
    }
    test('scans', () => __awaiter(this, void 0, void 0, function* () {
        const namespaceFunctions = yield getNamespaceFunctions('memberof-functions.js');
        const functionData = yield Promise.all(namespaceFunctions.map(getTestProps));
        chai_1.assert.deepEqual(functionData, [
            {
                name: 'Polymer.aaa',
                description: 'aaa',
                summary: '',
                warnings: [],
                params: [{
                        desc: 'This is the first argument',
                        name: 'a',
                        type: 'Number',
                    }],
                privacy: 'public', return: undefined,
                codeSnippet: `
function aaa(a) {
~~~~~~~~~~~~~~~~~
  return a;
~~~~~~~~~~~
}
~`,
            },
            {
                name: 'Polymer.bbb',
                description: 'bbb',
                summary: '',
                warnings: [],
                params: [], return: undefined,
                privacy: 'public',
                codeSnippet: `
Polymer.bbb = function bbb() {
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


};
~~`,
            },
            {
                name: 'Polymer.ccc',
                description: 'ccc',
                summary: '',
                warnings: [],
                params: [], return: undefined,
                privacy: 'protected',
                codeSnippet: `
  function ccc() {
  ~~~~~~~~~~~~~~~~
  }
~~~`,
            },
            {
                name: 'Polymer._ddd',
                description: 'ddd',
                summary: '',
                warnings: [],
                privacy: 'protected',
                params: [], return: undefined,
                codeSnippet: `
  _ddd: function() {
  ~~~~~~~~~~~~~~~~~~


  },
~~~`,
            },
            {
                name: 'Polymer.eee',
                description: 'eee',
                summary: '',
                warnings: [],
                params: [], return: undefined,
                privacy: 'private',
                codeSnippet: `
  eee: () => {},
  ~~~~~~~~~~~~~`,
            },
            {
                name: 'Polymer.fff',
                description: 'fff',
                summary: '',
                warnings: [],
                params: [], return: undefined,
                privacy: 'public',
                codeSnippet: `
  fff() {
  ~~~~~~~


  },
~~~`,
            },
            {
                name: 'Polymer.ggg',
                description: 'ggg',
                summary: '',
                warnings: [],
                params: [], return: undefined,
                privacy: 'public',
                codeSnippet: `
  ggg: someFunction,
  ~~~~~~~~~~~~~~~~~`,
            },
            {
                name: 'Polymer.hhh_',
                description: 'hhh_ should be private',
                summary: '',
                warnings: [],
                params: [], return: undefined,
                privacy: 'private',
                codeSnippet: `
  hhh_: someOtherFunc,
  ~~~~~~~~~~~~~~~~~~~`,
            },
            {
                name: 'Polymer.__iii',
                description: '__iii should be private too',
                summary: '',
                warnings: [],
                params: [], return: undefined,
                privacy: 'private',
                codeSnippet: `
  __iii() { },
  ~~~~~~~~~~~`,
            },
            {
                name: 'Polymer.jjj',
                description: 'jjj',
                summary: '',
                warnings: [],
                params: [], return: undefined,
                privacy: 'public',
                codeSnippet: `
var jjj = function() {
~~~~~~~~~~~~~~~~~~~~~~


};
~~`,
            },
        ]);
    }));
});

//# sourceMappingURL=function-scanner_test.js.map
