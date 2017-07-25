/**
 * Expands a series of path patterns (globs, files, directories) into a set of
 * files that represent those patterns.
 *
 * @param baseDir The directory that patterns are relative to.
 * @param patterns The patterns to expand.
 * @returns The expanded paths.
 */
export declare function expand(baseDir: string, patterns: string[]): Promise<string[]>;
