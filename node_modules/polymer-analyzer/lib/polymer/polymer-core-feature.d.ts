import { Document, Feature, Method, Property, Resolvable, ScannedFeature, ScannedMethod, ScannedProperty, Warning } from '../model/model';
/**
 * A scanned Polymer 1.x core "feature".
 */
export declare class ScannedPolymerCoreFeature extends ScannedFeature implements Resolvable {
    warnings: Warning[];
    properties: Map<string, ScannedProperty>;
    methods: Map<string, ScannedMethod>;
    resolve(document: Document): Feature | undefined;
}
declare module '../model/queryable' {
    interface FeatureKindMap {
        'polymer-core-feature': PolymerCoreFeature;
    }
}
/**
 * A resolved Polymer 1.x core "feature".
 */
export declare class PolymerCoreFeature implements Feature {
    properties: Map<string, Property>;
    methods: Map<string, Method>;
    kinds: Set<string>;
    identifiers: Set<string>;
    warnings: Warning[];
    constructor(properties: Map<string, Property>, methods: Map<string, Method>);
}
