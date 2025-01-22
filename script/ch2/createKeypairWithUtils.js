const {
  privateToPublic,
  publicToAddress,
  toChecksumAddress,
} = require('ethereumjs-util');

// Replace with your private key (keep it secure!)
const privateKey = Buffer.from(
  'bed4c077eaf218a0037d44f3caa5e3eaa130a3ff17a129241bb8a3bf4b410b3a',
  'hex'
);

// Derive the public key from the private key
const publicKey = privateToPublic(privateKey).toString('hex');

// Derive the address from the public key
const address = toChecksumAddress(
  '0x' + publicToAddress(privateToPublic(privateKey)).toString('hex')
);

console.log('Public Key:', `0x${publicKey}`);
console.log('Address:', address);
