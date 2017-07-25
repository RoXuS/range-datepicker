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
const fs = require("fs");
const path = require("path");
const javascript_parser_1 = require("../../javascript/javascript-parser");
const behavior_1 = require("../../polymer/behavior");
const behavior_scanner_1 = require("../../polymer/behavior-scanner");
suite('BehaviorScanner', () => {
    let document;
    let behaviors;
    let behaviorsList;
    suiteSetup(() => __awaiter(this, void 0, void 0, function* () {
        const parser = new javascript_parser_1.JavaScriptParser();
        const file = fs.readFileSync(path.resolve(__dirname, '../static/js-behaviors.js'), 'utf8');
        document = parser.parse(file, '/static/js-behaviors.js');
        const scanner = new behavior_scanner_1.BehaviorScanner();
        const visit = (visitor) => Promise.resolve(document.visit([visitor]));
        const { features } = yield scanner.scan(document, visit);
        behaviors = new Map();
        behaviorsList =
            features.filter((e) => e instanceof behavior_1.ScannedBehavior);
        for (const behavior of behaviorsList) {
            behaviors.set(behavior.className, behavior);
        }
    }));
    test('Finds behavior object assignments', () => {
        chai_1.assert.deepEqual(behaviorsList.map((b) => b.className).sort(), [
            'SimpleBehavior',
            'Polymer.SimpleNamespacedBehavior',
            'AwesomeBehavior',
            'Polymer.AwesomeNamespacedBehavior',
            'Really.Really.Deep.Behavior',
            'CustomBehaviorList'
        ].sort());
    });
    test('Supports behaviors at local assignments', () => {
        chai_1.assert(behaviors.has('SimpleBehavior'));
        chai_1.assert.equal(behaviors.get('SimpleBehavior').properties.values().next().value.name, 'simple');
    });
    test('Supports behaviors with renamed paths', () => {
        chai_1.assert(behaviors.has('AwesomeBehavior'));
        chai_1.assert(behaviors.get('AwesomeBehavior').properties.has('custom'));
    });
    test('Supports behaviors On.Property.Paths', () => {
        chai_1.assert(behaviors.has('Really.Really.Deep.Behavior'));
        chai_1.assert.equal(behaviors.get('Really.Really.Deep.Behavior').properties
            .get('deep').name, 'deep');
    });
    test('Supports property array on behaviors', () => {
        let defaultValue;
        behaviors.get('AwesomeBehavior').properties.forEach((prop) => {
            if (prop.name === 'a') {
                defaultValue = prop.default;
            }
        });
        chai_1.assert.equal(defaultValue, 1);
    });
    test('Supports chained behaviors', function () {
        chai_1.assert(behaviors.has('CustomBehaviorList'));
        const childBehaviors = behaviors.get('CustomBehaviorList').behaviorAssignments;
        const deepChainedBehaviors = behaviors.get('Really.Really.Deep.Behavior').behaviorAssignments;
        chai_1.assert.deepEqual(childBehaviors.map((b) => b.name), ['SimpleBehavior', 'AwesomeBehavior', 'Really.Really.Deep.Behavior']);
        chai_1.assert.deepEqual(deepChainedBehaviors.map((b) => b.name), ['Do.Re.Mi.Fa']);
    });
    test('Does not count methods as properties', function () {
        const behavior = behaviors.get('Polymer.SimpleNamespacedBehavior');
        if (!behavior) {
            throw new Error('Could not find Polymer.SimpleNamespacedBehavior');
        }
        chai_1.assert.deepEqual([...behavior.methods.keys()], ['method']);
        chai_1.assert.deepEqual([...behavior.properties.keys()], ['simple']);
    });
});

//# sourceMappingURL=behavior-scanner_test.js.map
