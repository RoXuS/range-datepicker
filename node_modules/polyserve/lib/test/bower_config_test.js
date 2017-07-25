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
const path = require("path");
const bower_config_1 = require("../bower_config");
suite('bowerConfig', () => {
    test('reads bower.json', () => {
        let config = bower_config_1.bowerConfig(path.join(__dirname, '..', '..', 'test'));
        chai_1.assert.equal(config.name, 'polyserve-test');
    });
});
//# sourceMappingURL=bower_config_test.js.map