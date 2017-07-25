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
const javascript_parser_1 = require("../../javascript/javascript-parser");
const namespace_1 = require("../../javascript/namespace");
const namespace_scanner_1 = require("../../javascript/namespace-scanner");
const fs_url_loader_1 = require("../../url-loader/fs-url-loader");
const test_utils_1 = require("../test-utils");
suite('NamespaceScanner', () => {
    const testFilesDir = path.resolve(__dirname, '../static/namespaces/');
    const urlLoader = new fs_url_loader_1.FSUrlLoader(testFilesDir);
    const underliner = new test_utils_1.CodeUnderliner(urlLoader);
    function getNamespaces(filename) {
        return __awaiter(this, void 0, void 0, function* () {
            const file = yield urlLoader.load(filename);
            const parser = new javascript_parser_1.JavaScriptParser();
            const document = parser.parse(file, filename);
            const scanner = new namespace_scanner_1.NamespaceScanner();
            const visit = (visitor) => Promise.resolve(document.visit([visitor]));
            const { features } = yield scanner.scan(document, visit);
            return features.filter((e) => e instanceof namespace_1.ScannedNamespace);
        });
    }
    ;
    test('scans named namespaces', () => __awaiter(this, void 0, void 0, function* () {
        const namespaces = yield getNamespaces('namespace-named.js');
        chai_1.assert.equal(namespaces.length, 2);
        chai_1.assert.equal(namespaces[0].name, 'ExplicitlyNamedNamespace');
        chai_1.assert.equal(namespaces[0].description, '');
        chai_1.assert.deepEqual(namespaces[0].warnings, []);
        chai_1.assert.equal(yield underliner.underline(namespaces[0].sourceRange), `
var ExplicitlyNamedNamespace = {};
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~`);
        chai_1.assert.equal(namespaces[1].name, 'ExplicitlyNamedNamespace.NestedNamespace');
        chai_1.assert.equal(namespaces[1].description, '');
        chai_1.assert.deepEqual(namespaces[1].warnings, []);
        chai_1.assert.equal(yield underliner.underline(namespaces[1].sourceRange), `
ExplicitlyNamedNamespace.NestedNamespace = {
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  foo: \'bar\'
~~~~~~~~~~~~
};
~~`);
    }));
    test('scans unnamed namespaces', () => __awaiter(this, void 0, void 0, function* () {
        const namespaces = yield getNamespaces('namespace-unnamed.js');
        chai_1.assert.equal(namespaces.length, 4);
        chai_1.assert.equal(namespaces[0].name, 'ImplicitlyNamedNamespace');
        chai_1.assert.equal(namespaces[0].description, 'A namespace description');
        chai_1.assert.equal(namespaces[0].summary, 'A namespace summary');
        chai_1.assert.deepEqual(namespaces[0].warnings, []);
        chai_1.assert.equal(yield underliner.underline(namespaces[0].sourceRange), `
var ImplicitlyNamedNamespace = {};
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~`);
        chai_1.assert.equal(namespaces[1].name, 'ImplicitlyNamedNamespace.NestedNamespace');
        chai_1.assert.equal(namespaces[1].description, '');
        chai_1.assert.deepEqual(namespaces[1].warnings, []);
        chai_1.assert.equal(yield underliner.underline(namespaces[1].sourceRange), `
ImplicitlyNamedNamespace.NestedNamespace = {
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  foo: \'bar\'
~~~~~~~~~~~~
};
~~`);
        chai_1.assert.equal(namespaces[2].name, 'ParentNamespace.FooNamespace');
        chai_1.assert.equal(namespaces[2].description, '');
        chai_1.assert.deepEqual(namespaces[2].warnings, []);
        chai_1.assert.equal(yield underliner.underline(namespaces[2].sourceRange), `
FooNamespace = {
~~~~~~~~~~~~~~~~
  foo: \'bar\'
~~~~~~~~~~~~
};
~~`);
        chai_1.assert.equal(namespaces[3].name, 'ParentNamespace.BarNamespace');
        chai_1.assert.equal(namespaces[3].description, '');
        chai_1.assert.deepEqual(namespaces[3].warnings, []);
        chai_1.assert.equal(yield underliner.underline(namespaces[3].sourceRange), `
ParentNamespace.BarNamespace = {
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  foo: \'bar\'
~~~~~~~~~~~~
};
~~`);
    }));
    test('scans named, dynamic namespaces', () => __awaiter(this, void 0, void 0, function* () {
        const namespaces = yield getNamespaces('namespace-dynamic-named.js');
        chai_1.assert.equal(namespaces.length, 3);
        chai_1.assert.equal(namespaces[0].name, 'DynamicNamespace.ComputedProperty');
        chai_1.assert.equal(namespaces[0].description, '');
        chai_1.assert.deepEqual(namespaces[0].warnings, []);
        chai_1.assert.equal(yield underliner.underline(namespaces[0].sourceRange), `
DynamicNamespace['ComputedProperty'] = {
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  foo: 'bar'
~~~~~~~~~~~~
};
~~`);
        chai_1.assert.equal(namespaces[1].name, 'DynamicNamespace.UnanalyzableComputedProperty');
        chai_1.assert.equal(namespaces[1].description, '');
        chai_1.assert.deepEqual(namespaces[1].warnings, []);
        chai_1.assert.equal(yield underliner.underline(namespaces[1].sourceRange), `
DynamicNamespace[baz] = {
~~~~~~~~~~~~~~~~~~~~~~~~~
  foo: 'bar'
~~~~~~~~~~~~
};
~~`);
        chai_1.assert.equal(namespaces[2].name, 'DynamicNamespace.Aliased');
        chai_1.assert.equal(namespaces[2].description, '');
        chai_1.assert.deepEqual(namespaces[2].warnings, []);
        chai_1.assert.equal(yield underliner.underline(namespaces[2].sourceRange), `
aliasToNamespace = {
~~~~~~~~~~~~~~~~~~~~
  foo: 'bar'
~~~~~~~~~~~~
};
~~`);
    }));
    test('scans unnamed, dynamic namespaces', () => __awaiter(this, void 0, void 0, function* () {
        const namespaces = yield getNamespaces('namespace-dynamic-unnamed.js');
        chai_1.assert.equal(namespaces.length, 1);
        chai_1.assert.equal(namespaces[0].name, 'DynamicNamespace.InferredComputedProperty');
        chai_1.assert.equal(namespaces[0].description, '');
        chai_1.assert.deepEqual(namespaces[0].warnings, []);
        chai_1.assert.equal(yield underliner.underline(namespaces[0].sourceRange), `
DynamicNamespace['InferredComputedProperty'] = {
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  foo: 'bar'
~~~~~~~~~~~~
};
~~`);
    }));
});

//# sourceMappingURL=namespace-scanner_test.js.map
