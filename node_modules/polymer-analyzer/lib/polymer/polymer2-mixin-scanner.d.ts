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
import { Visitor } from '../javascript/estree-visitor';
import { JavaScriptDocument } from '../javascript/javascript-document';
import * as jsdoc from '../javascript/jsdoc';
import { Warning } from '../model/model';
import { ScannedPolymerElementMixin } from './polymer-element-mixin';
export declare class MixinVisitor implements Visitor {
    mixins: ScannedPolymerElementMixin[];
    private _document;
    private _currentMixin;
    private _currentMixinNode;
    private _currentMixinFunction;
    readonly warnings: Warning[];
    constructor(document: JavaScriptDocument);
    enterAssignmentExpression(node: estree.AssignmentExpression, parent: estree.Node): void;
    enterFunctionDeclaration(node: estree.FunctionDeclaration, _parent: estree.Node): void;
    leaveFunctionDeclaration(node: estree.FunctionDeclaration, _parent: estree.Node): void;
    enterVariableDeclaration(node: estree.VariableDeclaration, _parent: estree.Node): void;
    leaveVariableDeclaration(node: estree.VariableDeclaration, _parent: estree.Node): void;
    enterFunctionExpression(node: estree.FunctionExpression, _parent: estree.Node): void;
    enterArrowFunctionExpression(node: estree.ArrowFunctionExpression, _parent: estree.Node): void;
    enterClassExpression(node: estree.ClassExpression, parent: estree.Node): void;
    enterClassDeclaration(node: estree.ClassDeclaration, _parent: estree.Node): void;
    private _handleClass(node);
}
export declare function hasMixinFunctionDocTag(docs: jsdoc.Annotation): boolean;
export declare function hasMixinClassDocTag(docs: jsdoc.Annotation): boolean;
