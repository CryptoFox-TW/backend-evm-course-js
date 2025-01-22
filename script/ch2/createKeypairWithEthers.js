const { ethers } = require('ethers');

/*
 * ---------------------------------------------------
 * Phrase1: Generate a wallet
 * ---------------------------------------------------
 */
// const wallet = ethers.Wallet.createRandom();
const wallet = new ethers.Wallet(
  '0xbed4c077eaf218a0037d44f3caa5e3eaa130a3ff17a129241bb8a3bf4b410b3a'
);
console.log('Wallet:', wallet);

/*
 * ---------------------------------------------------
 * Phrase2: Get the private key, public key, and address
 * ---------------------------------------------------
 */
console.log('Private Key:', wallet.privateKey);
console.log('Public Key:', wallet.publicKey);
console.log('Address:', wallet.address);
