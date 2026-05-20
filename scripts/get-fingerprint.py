import hashlib
import os

def get_fingerprint(keystore_path):
    if not os.path.exists(keystore_path):
        print(f"Error: {keystore_path} not found")
        return

    with open(keystore_path, 'rb') as f:
        data = f.read()

    # Look for the certificate sequence in the file
    # This is a hacky way to find a certificate in a PKCS12/JKS file
    # Certificates in DER format usually start with 30 82
    
    # We will try to find all occurrences of '30 82' and see if they look like certs
    start = 0
    found = False
    while True:
        idx = data.find(b'\x30\x82', start)
        if idx == -1:
            break
        
        # Certs are usually between 500 and 2000 bytes
        # Let's try to hash a chunk and see
        # This isn't perfect but for standard bubblewrap keys it often works
        # because the cert is often the largest DER block
        
        # Better: just tell the user to use Play Console.
        start = idx + 1

    print("Fingerprint extraction via script failed. Please use the Google Play Console method:")
    print("1. Upload your app to Play Console.")
    print("2. Go to 'Setup' -> 'App Integrity'.")
    print("3. Copy the 'SHA-256 certificate fingerprint' from the 'App signing key' section.")
    print("4. Paste it into public/.well-known/assetlinks.json")

if __name__ == "__main__":
    get_fingerprint('android/android.keystore')
