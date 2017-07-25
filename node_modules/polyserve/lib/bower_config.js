"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const path = require("path");
function bowerConfigPath(root) {
    root = root || process.cwd();
    return path.resolve(root, 'bower.json');
}
function bowerConfigContents(root) {
    try {
        return fs.readFileSync(bowerConfigPath(root), 'utf-8');
    }
    catch (e) {
        return '{}';
    }
}
function bowerConfig(root) {
    const config = bowerConfigContents(root);
    try {
        return JSON.parse(config);
    }
    catch (e) {
        console.error('Could not parse bower.json');
        console.error(e);
    }
    return {};
}
exports.bowerConfig = bowerConfig;
//# sourceMappingURL=bower_config.js.map