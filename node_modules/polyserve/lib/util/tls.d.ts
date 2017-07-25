export interface KeyAndCert {
    key: string;
    cert: string;
}
/**
 * Gets the current TLS certificate (from current directory)
 * or generates one if needed
 * @param {string} keyPath path to TLS service key
 * @param {string} certPath path to TLS certificate
 * @returns {Promise<{}>} Promise of {key: string, cert: string}
 */
export declare function getTLSCertificate(keyPath: string, certPath: string): Promise<KeyAndCert>;
