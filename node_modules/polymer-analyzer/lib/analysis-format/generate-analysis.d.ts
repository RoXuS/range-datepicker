import * as jsonschema from 'jsonschema';
import { Function as ResolvedFunction } from '../javascript/function';
import { Analysis as AnalysisResult, Element as ResolvedElement, ElementMixin as ResolvedMixin, Feature } from '../model/model';
import { Analysis } from './analysis-format';
export declare type ElementOrMixin = ResolvedElement | ResolvedMixin;
export declare type Filter = (feature: Feature | ResolvedFunction) => boolean;
export declare function generateAnalysis(input: AnalysisResult, packagePath: string, filter?: Filter): Analysis;
export declare class ValidationError extends Error {
    errors: jsonschema.ValidationError[];
    constructor(result: jsonschema.ValidatorResult);
}
/**
 * Throws if the given object isn't a valid AnalyzedPackage according to
 * the JSON schema.
 */
export declare function validateAnalysis(analyzedPackage: Analysis | null | undefined): void;
