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
import * as estree from 'estree';
import { JavaScriptDocument } from '../javascript/javascript-document';
import { Warning } from '../model/model';
import { ScannedBehaviorAssignment } from '../polymer/behavior';
import { Observer, ScannedPolymerElement } from './polymer-element';
export declare type BehaviorAssignmentOrWarning = {
    kind: 'warning';
    warning: Warning;
} | {
    kind: 'behaviorAssignment';
    assignment: ScannedBehaviorAssignment;
};
export declare function getBehaviorAssignmentOrWarning(argNode: estree.Node, document: JavaScriptDocument): BehaviorAssignmentOrWarning;
export declare type PropertyHandlers = {
    [key: string]: (node: estree.Node) => void;
};
/**
 * Returns an object containing functions that will annotate `declaration` with
 * the polymer-specific meaning of the value nodes for the named properties.
 */
export declare function declarationPropertyHandlers(declaration: ScannedPolymerElement, document: JavaScriptDocument): PropertyHandlers;
export declare function extractObservers(observersArray: estree.Node, document: JavaScriptDocument): undefined | {
    observers: Observer[];
    warnings: Warning[];
};
