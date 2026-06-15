/**
 * Lift App API Protection Query — Signature Generator
 * ====================================================
 * Reproduces the exact signature algorithm from g5/c.c() in the decompiled APK.
 *
 * Algorithm: HMAC-SHA256
 * Secret Key: nwS1u7oJW2Nvf1XIMEnaqSzYxF82HCAL
 */

const crypto = require('crypto');

// ─── Constants ───────────────────────────────────────────────────────────────

const SECRET_KEY = "nwS1u7oJW2Nvf1XIMEnaqSzYxF82HCAL";
const APP_VERSION_CODE = 33; // from AndroidManifest.xml: android:versionCode="33"
const PLATFORM = "android";

// Base64 URL-safe, no padding (Android Base64.NO_WRAP | NO_PADDING | URL_SAFE = 11)
function b64url_nopad(data) {
    return Buffer.from(data).toString('base64url');
}

// ─── Step 1: SHA-256 hash of body ───────────────────────────────────────────

function hashBody(body) {
    return crypto.createHash('sha256').update(body, 'utf8').digest('hex');
}

// ─── Step 2: Generate timestamp ─────────────────────────────────────────────

function getTimestamp() {
    return String(Date.now());
}

// ─── Step 3: Generate nonce ─────────────────────────────────────────────────

function getNonce() {
    return b64url_nopad(crypto.randomBytes(16));
}

// ─── Step 4: Extract path from URL (strip _ap_* params) ─────────────────────

function extractPathForSigning(url) {
    const parsed = new URL(url);
    const path = parsed.pathname || '/';
    
    // Parse query params, excluding _ap_* params
    const params = new URLSearchParams(parsed.search);
    const filtered = new URLSearchParams();
    for (const [k, v] of params.entries()) {
        if (!k.startsWith('_ap_')) {
            filtered.append(k, v);
        }
    }
    
    const query = filtered.toString();
    return query ? path + '?' + query : path;
}

// ─── Step 5: Build HMAC payload ─────────────────────────────────────────────

function buildPayload(method, path, bodyHash, timestamp, nonce, versionCode) {
    return [method, path, bodyHash, timestamp, nonce, versionCode].join('\n');
}

// ─── Step 6: Compute HMAC-SHA256 signature ──────────────────────────────────

function computeSignature(payload) {
    return crypto.createHmac('sha256', SECRET_KEY).update(payload, 'utf8').digest('base64url');
}

// ─── Main function: generate protection query ───────────────────────────────

function getApiProtectionQuery(method, url, body = '', versionCode = APP_VERSION_CODE) {
    method = method.trim().toUpperCase();
    const path = extractPathForSigning(url);
    const bodyHash = hashBody(body);
    const timestamp = getTimestamp();
    const nonce = getNonce();
    const versionStr = String(versionCode);
    
    const payload = buildPayload(method, path, bodyHash, timestamp, nonce, versionStr);
    const signature = computeSignature(payload);
    
    return {
        _ap_platform: PLATFORM,
        _ap_ts: timestamp,
        _ap_nonce: nonce,
        _ap_v: versionStr,
        _ap_body: bodyHash,
        _ap_sig: signature
    };
}

// ─── Helper: append protection params to URL ────────────────────────────────

function signUrl(method, url, body = '', versionCode = APP_VERSION_CODE) {
    const params = getApiProtectionQuery(method, url, body, versionCode);
    const parsed = new URL(url);
    for (const [k, v] of Object.entries(params)) {
        parsed.searchParams.set(k, v);
    }
    return parsed.toString();
}

// ─── Example usage ──────────────────────────────────────────────────────────

console.log("=".repeat(70));
console.log("Lift App API Protection Query — Signature Generator");
console.log("=".repeat(70));
console.log();

// Example 1: GET request
console.log("Example 1: GET /list?type=film&last=true&limit=20");
console.log("-".repeat(70));
const params1 = getApiProtectionQuery("GET", "https://api.lateremb.ws/list?type=film&last=true&limit=20");
console.log(JSON.stringify(params1, null, 2));
console.log();

// Example 2: POST request with body
console.log("Example 2: POST /auth/login");
console.log("-".repeat(70));
const body2 = JSON.stringify({email: "test@example.com", password: "secret"});
const params2 = getApiProtectionQuery("POST", "https://api.lateremb.ws/auth/login", body2);
console.log(JSON.stringify(params2, null, 2));
console.log();

// Example 3: Full signed URL
console.log("Example 3: Full signed URL");
console.log("-".repeat(70));
const signedUrl = signUrl("GET", "https://api.lateremb.ws/list?type=film&last=true&limit=20");
console.log(signedUrl);
console.log();

// Example 4: Search
console.log("Example 4: GET /search?q=matrix");
console.log("-".repeat(70));
const params4 = getApiProtectionQuery("GET", "https://api.lateremb.ws/search?q=matrix");
console.log(JSON.stringify(params4, null, 2));
console.log();

// Example 5: Info
console.log("Example 5: GET /info/12345");
console.log("-".repeat(70));
const params5 = getApiProtectionQuery("GET", "https://api.lateremb.ws/info/12345");
console.log(JSON.stringify(params5, null, 2));
console.log();

// Example 6: Sync progress (authenticated)
console.log("Example 6: POST /sync/progress (with Bearer token)");
console.log("-".repeat(70));
const body6 = JSON.stringify({id: "12345", season: 1, episode: 3, position: 123456});
const params6 = getApiProtectionQuery("POST", "https://api.lateremb.ws/sync/progress", body6);
console.log(JSON.stringify(params6, null, 2));
console.log();

console.log("=".repeat(70));
console.log("Algorithm Summary:");
console.log(`  Secret Key: ${SECRET_KEY}`);
console.log(`  Algorithm:  HMAC-SHA256`);
console.log(`  Payload:    METHOD\\npath\\nbodyHashHex\\ntimestamp\\nnonce\\nversionCode`);
console.log(`  Signature:  Base64URL(HMAC-SHA256(secret, payload))`);
console.log(`  Nonce:      16 random bytes, Base64URL no padding`);
console.log(`  Timestamp:  milliseconds since epoch`);
console.log(`  Body hash:  SHA-256(body) → lowercase hex`);
console.log("=".repeat(70));