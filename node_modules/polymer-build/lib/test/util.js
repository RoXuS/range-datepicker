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
function getFlowingState(stream) {
    // Cast our streams to <any> so that we can check the flowing state.
    // _readableState is undocumented in the Node.js TypeScript definition,
    // however it is the supported way to assert if a stream is flowing or not.
    // See: https://nodejs.org/api/stream.html#stream_three_states
    const privateReadableState = stream._readableState;
    return privateReadableState.flowing;
}
exports.getFlowingState = getFlowingState;
/**
 * This method makes it possible to `await` a map of paths to `File` objects
 * emitted by a stream. It returns a Promise that resolves with the map
 * where the paths in the map exclude the optional `root` prefix.
 */
function emittedFiles(stream, root = '') {
    return __awaiter(this, void 0, void 0, function* () {
        const files = new Map();
        return new Promise((resolve, reject) => stream
            .on('data', (f) => files.set(f.path.substring(root.length + 1), f))
            .on('data', () => { })
            .on('end', () => resolve(files))
            .on('error', (e) => reject(e)));
    });
}
exports.emittedFiles = emittedFiles;
