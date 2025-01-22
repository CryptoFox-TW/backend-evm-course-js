/*
 * ---------------------------------------------------
 * Phrase1: Generate a random private key
 * ---------------------------------------------------
 */
const crypto = require('crypto');

let privateKey =
  'bed4c077eaf218a0037d44f3caa5e3eaa130a3ff17a129241bb8a3bf4b410b3a';
// '2024c4b23f15b34547c7c5feaae4f7b53ce9e937cb3b0f1b2f347178c46cfda3';
// let privateKey = crypto.randomBytes(32).toString('hex');
console.log('PrivateKey:', appendHexPrefix(privateKey));

/*
 * ---------------------------------------------------
 * Phrase2: Generate a public key from the private key
 * ---------------------------------------------------
 */
const EC = require('elliptic');
const secp256k1 = new EC.ec('secp256k1');

const keyPair = secp256k1.keyFromPrivate(privateKey, 'hex');
const uncompressedPublicKey = keyPair.getPublic().encode('hex');
const compressedPublicKey = keyPair.getPublic().encodeCompressed('hex');

console.log('Uncompressed Public Key:', appendHexPrefix(uncompressedPublicKey));
console.log('Compressed Public Key:', appendHexPrefix(compressedPublicKey));

/*
 * ---------------------------------------------------
 * Phrase3: Generate an address from the public key
 * ---------------------------------------------------
 */

const pkg = require('js-sha3');
const { keccak_256 } = pkg;
const { ethers } = require('ethers');

// Remove the '04' prefix (1 bytes)
const publicKeyBuffer = Buffer.from(uncompressedPublicKey.slice(2), 'hex');

// Hash the public key with Keccak-256
const publicKeyAfterKeccak256 = keccak_256(publicKeyBuffer);
console.log(
  'Public Key After Keccak-256:',
  appendHexPrefix(publicKeyAfterKeccak256)
);

// Take the last 20 bytes of the hash as the address
const address = appendHexPrefix(publicKeyAfterKeccak256.slice(-40));
console.log('Address:', address);

// Convert to checksum address
const checksumAddress = ethers.getAddress(address);
console.log('Checksum Address:', checksumAddress);

/*
 * ---------------------------------------------------
 * Function: appendHexPrefix
 * ---------------------------------------------------
 */
function appendHexPrefix(value) {
  return '0x' + value;
}
