/// <reference types="node" />
/// <reference types="vinyl" />
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
import File = require('vinyl');
export declare function getFlowingState(stream: NodeJS.ReadableStream): boolean;
/**
 * This method makes it possible to `await` a map of paths to `File` objects
 * emitted by a stream. It returns a Promise that resolves with the map
 * where the paths in the map exclude the optional `root` prefix.
 */
export declare function emittedFiles(stream: NodeJS.ReadableStream, root?: string): Promise<Map<string, File>>;
