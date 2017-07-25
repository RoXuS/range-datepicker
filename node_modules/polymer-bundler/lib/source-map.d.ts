/// <reference types="source-map" />
import * as parse5 from 'parse5';
import { Analyzer, Document } from 'polymer-analyzer';
import { AnalysisContext } from 'polymer-analyzer/lib/core/analysis-context';
import { RawSourceMap } from 'source-map';
export declare function getExistingSourcemap(analyzer: Analyzer, sourceUrl: string, sourceContent: string): Promise<RawSourceMap | null>;
/**
 * For an inline script AST node, locate an existing source map url comment.
 * If found, load that source map. If no source map url comment is found,
 * create an identity source map.
 *
 * In both cases, the generated mappings reflect the relative position of
 * a token within the script tag itself (rather than the document). This
 * is because the final position within the document is not yet known. These
 * relative positions will be updated later to reflect the absolute position
 * within the bundled document.
 */
export declare function addOrUpdateSourcemapComment(analyzer: AnalysisContext | Analyzer, sourceUrl: string, sourceContent: string, originalLineOffset: number, originalFirstLineCharOffset: number, generatedLineOffset: number, generatedFirtLineCharOffset: number): Promise<string>;
/**
 * Update mappings in source maps within inline script elements to reflect
 * their absolute position within a bundle. Assumes existing mappings
 * are relative to their position within the script tag itself.
 */
export declare function updateSourcemapLocations(document: Document, ast: parse5.ASTNode): parse5.ASTNode;
