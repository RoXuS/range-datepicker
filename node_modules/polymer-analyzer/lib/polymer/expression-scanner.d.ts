import * as estree from 'estree';
import * as parse5 from 'parse5';
import { ParsedHtmlDocument } from '../html/html-document';
import { JavaScriptDocument } from '../javascript/javascript-document';
import { SourceRange, Warning } from '../model/model';
import { ParsedDocument } from '../parser/document';
export interface Template extends parse5.ASTNode {
    content: parse5.ASTNode;
}
/**
 * Given a node, return all databinding templates inside it.
 *
 * A template is "databinding" if polymer databinding expressions are expected
 * to be evaluated inside. e.g. <template is='dom-if'> or <dom-module><template>
 *
 * Results include both direct and nested templates (e.g. dom-if inside
 * dom-module).
 */
export declare function getAllDataBindingTemplates(node: parse5.ASTNode): Template[];
export declare type HtmlDatabindingExpression = TextNodeDatabindingExpression | AttributeDatabindingExpression;
/**
 * Some expressions are limited. For example, in a property declaration,
 * `observer` must be the identifier of a method, and `computed` must be a
 * function call expression.
 */
export declare type ExpressionLimitation = 'full' | 'identifierOnly' | 'callExpression';
export declare abstract class DatabindingExpression {
    readonly sourceRange: SourceRange;
    readonly warnings: Warning[];
    readonly expressionText: string;
    private readonly _expressionAst;
    private readonly locationOffset;
    private readonly _document;
    /**
     * Toplevel properties on the model that are referenced in this expression.
     *
     * e.g. in {{foo(bar, baz.zod)}} the properties are foo, bar, and baz
     * (but not zod).
     */
    properties: Array<{
        name: string;
        sourceRange: SourceRange;
    }>;
    constructor(sourceRange: SourceRange, expressionText: string, ast: estree.Program, limitation: ExpressionLimitation, document: ParsedDocument);
    /**
     * Given an estree node in this databinding expression, give its source range.
     */
    sourceRangeForNode(node: estree.Node): SourceRange | undefined;
    private _extractPropertiesAndValidate(limitation);
    private _validateLimitation(expression, limitation);
    private _extractAndValidateSubExpression(expression, callAllowed);
    private _validationWarning(message, node);
}
export declare class AttributeDatabindingExpression extends DatabindingExpression {
    /**
     * The element whose attribute/property is assigned to.
     */
    readonly astNode: parse5.ASTNode;
    readonly databindingInto: string;
    /**
     * If true, this is databinding into the complete attribute. Polymer treats
     * such databindings specially, e.g. they're setting the property by default,
     * not the attribute.
     *
     * e.g.
     * foo="{{bar}}" is complete, foo="hello {{bar}} world" is not complete.
     *
     * An attribute may have multiple incomplete bindings. They will be separate
     * AttributeDatabindingExpressions.
     */
    readonly isCompleteBinding: boolean;
    /** The databinding syntax used. */
    readonly direction: '{' | '[';
    /**
     * If this is a two-way data binding, and an event name was specified
     * (using ::eventName syntax), this is that event name.
     */
    readonly eventName: string | undefined;
    /** The attribute we're databinding into. */
    readonly attribute: parse5.ASTAttribute;
    constructor(astNode: parse5.ASTNode, isCompleteBinding: boolean, direction: '{' | '[', eventName: string | undefined, attribute: parse5.ASTAttribute, sourceRange: SourceRange, expressionText: string, ast: estree.Program, document: ParsedHtmlDocument);
}
export declare class TextNodeDatabindingExpression extends DatabindingExpression {
    /** The databinding syntax used. */
    readonly direction: '{' | '[';
    /**
     * The HTML text node that contains this databinding.
     */
    readonly astNode: parse5.ASTNode;
    readonly databindingInto: string;
    constructor(direction: '{' | '[', astNode: parse5.ASTNode, sourceRange: SourceRange, expressionText: string, ast: estree.Program, document: ParsedHtmlDocument);
}
export declare class JavascriptDatabindingExpression extends DatabindingExpression {
    readonly astNode: estree.Node;
    readonly databindingInto: string;
    constructor(astNode: estree.Node, sourceRange: SourceRange, expressionText: string, ast: estree.Program, kind: ExpressionLimitation, document: JavaScriptDocument);
}
/**
 * Find and parse Polymer databinding expressions in HTML.
 */
export declare function scanDocumentForExpressions(document: ParsedHtmlDocument): {
    expressions: HtmlDatabindingExpression[];
    warnings: Warning[];
};
export declare function scanDatabindingTemplateForExpressions(document: ParsedHtmlDocument, template: Template): {
    expressions: HtmlDatabindingExpression[];
    warnings: Warning[];
};
export declare function parseExpressionInJsStringLiteral(document: JavaScriptDocument, stringLiteral: estree.Node, kind: 'identifierOnly' | 'callExpression' | 'full'): {
    databinding: JavascriptDatabindingExpression | undefined;
    warnings: Warning[];
};
