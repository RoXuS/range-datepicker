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
const analyzer_1 = require("../../core/analyzer");
const javascript_parser_1 = require("../../javascript/javascript-parser");
const polymer_core_feature_scanner_1 = require("../../polymer/polymer-core-feature-scanner");
const fs_url_loader_1 = require("../../url-loader/fs-url-loader");
suite('PolymerCoreFeatureScanner', () => {
    test('scans _addFeature calls and the Polymer.Base assignment', () => __awaiter(this, void 0, void 0, function* () {
        const js = `
      /** Feature A */
      Polymer.Base._addFeature({
        /** Method A */
        methodA: function() {},
        /** Prop A */
        propA: []
      });

      /** Feature B */
      Polymer.Base._addFeature({
        methodB: function() {}
      });

      /** Polymer.Base declaration */
      Polymer.Base = {
        methodBase: function() {}
      };

      /** Invalid feature */
      Polymer.Base._addFeature(null);

      /** Not a feature at all */
      Polymer.Base._somethingElse({
        methodX: function() {}
      });
    `;
        const parser = new javascript_parser_1.JavaScriptParser();
        const scanner = new polymer_core_feature_scanner_1.PolymerCoreFeatureScanner();
        const doc = parser.parse(js, 'features.js');
        const visit = (visitor) => Promise.resolve(doc.visit([visitor]));
        const { features } = yield scanner.scan(doc, visit);
        chai_1.assert.lengthOf(features, 4);
        const [a, b, base, invalid] = features;
        chai_1.assert.equal(a.description, 'Feature A');
        chai_1.assert.deepEqual(a.warnings, []);
        chai_1.assert.deepEqual([...a.properties.values()].map(({ name, type, description }) => ({ name, type, description })), [{
                name: 'propA',
                type: 'Array',
                description: 'Prop A',
            }]);
        chai_1.assert.deepEqual([...a.methods.values()].map(({ name, type, description }) => ({ name, type, description })), [{
                name: 'methodA',
                type: 'Function',
                description: 'Method A',
            }]);
        chai_1.assert.equal(b.description, 'Feature B');
        chai_1.assert.deepEqual(b.warnings, []);
        chai_1.assert.deepEqual([...b.properties.values()], []);
        chai_1.assert.deepEqual([...b.methods.values()].map(({ name, type, description }) => ({ name, type, description })), [{
                name: 'methodB',
                type: 'Function',
                description: '',
            }]);
        chai_1.assert.equal(base.description, 'Polymer.Base declaration');
        chai_1.assert.deepEqual(base.warnings, []);
        chai_1.assert.deepEqual([...base.properties.values()], []);
        chai_1.assert.deepEqual([...base.methods.values()].map(({ name, type, description }) => ({ name, type, description })), [{
                name: 'methodBase',
                type: 'Function',
                description: '',
            }]);
        chai_1.assert.lengthOf(invalid.warnings, 1);
    }));
    test('resolves the Polymer.Base class', () => __awaiter(this, void 0, void 0, function* () {
        const analyzer = new analyzer_1.Analyzer({
            urlLoader: new fs_url_loader_1.FSUrlLoader(
            // This directory contains files copied from Polymer 1.x core.
            path.resolve(__dirname, '../static/polymer-core-feature/')),
        });
        const analysis = yield analyzer.analyzePackage();
        const features = analysis.getFeatures({ id: 'Polymer.Base', kind: 'class' });
        chai_1.assert.equal(features.size, 1);
        const polymerBase = features.values().next().value;
        chai_1.assert.equal(polymerBase.methods.size, 35);
        chai_1.assert.equal(polymerBase.properties.size, 2);
        // A method from debounce.html
        const debounce = polymerBase.methods.get('debounce');
        chai_1.assert.isDefined(debounce);
        chai_1.assert.equal(debounce.privacy, 'public');
        chai_1.assert.equal(debounce.params[0].name, 'jobName');
        // A method from base.html
        const addFeature = polymerBase.methods.get('_addFeature');
        chai_1.assert.isDefined(addFeature);
        chai_1.assert.equal(addFeature.privacy, 'protected');
        // A property from behaviors.html
        const behaviors = polymerBase.properties.get('behaviors');
        chai_1.assert.isDefined(behaviors);
    }));
});

//# sourceMappingURL=polymer-core-feature_test.js.map
