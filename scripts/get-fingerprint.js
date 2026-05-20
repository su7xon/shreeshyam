/**
 * Extract SHA256 fingerprint from a PKCS12 keystore
 * Run: node scripts/get-fingerprint.js
 */
const forge = require('node-forge');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const keystorePath = path.join(__dirname, '..', 'android', 'android.keystore');
// Common bubblewrap passwords to try
const passwords = ['android', 'android_ks_pass', ''];

const keystoreData = fs.readFileSync(keystorePath);
const keystoreB64 = keystoreData.toString('binary');

let succeeded = false;

for (const pwd of passwords) {
  try {
    const p12Asn1 = forge.asn1.fromDer(keystoreB64);
    const p12 = forge.pkcs12.pkcs12FromAsn1(p12Asn1, pwd);

    p12.safeContents.forEach((safeContent) => {
      safeContent.safeBags.forEach((bag) => {
        if (bag.type === forge.pki.oids.certBag && bag.cert) {
          const certDer = forge.asn1.toDer(
            forge.pki.certificateToAsn1(bag.cert)
          ).getBytes();
          
          // Convert to Buffer for Node crypto
          const certBuf = Buffer.from(certDer, 'binary');
          const fingerprint = crypto
            .createHash('sha256')
            .update(certBuf)
            .digest('hex')
            .toUpperCase()
            .match(/.{2}/g)
            .join(':');

          console.log('\n✅ SHA256 Certificate Fingerprint (password: "' + pwd + '"):');
          console.log(fingerprint);
          console.log('\n📋 Copy this into:');
          console.log('  1. public/.well-known/assetlinks.json → sha256_cert_fingerprints array');
          console.log('  2. twa-manifest.json → fingerprints array\n');
          succeeded = true;
        }
      });
    });
    if (succeeded) break;
  } catch (err) {
    // try next password
  }
}

if (!succeeded) {
  console.log('❌ Could not extract fingerprint with common passwords.');
  console.log('Run bubblewrap to get fingerprint:');
  console.log('  npx @bubblewrap/cli fingerprint --keystore android.keystore --keyStorePassword android --keyAlias android --keyPassword android');
}
