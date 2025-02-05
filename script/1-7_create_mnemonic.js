const { ethers, Wallet } = require('ethers');

/*
 * ---------------------------------------------------
 * Phrase1: Generate mnemonics
 * ---------------------------------------------------
 */
const entropy = ethers.randomBytes(32);
const mnemonic = ethers.Mnemonic.fromEntropy(entropy);
console.log('Generated Mnemonic:', mnemonic);

/*
 * ---------------------------------------------------
 * Phrase2: Generate a wallet from the mnemonic
 * ---------------------------------------------------
 */
const wallet = Wallet.fromPhrase(mnemonic.phrase);
console.log('Wallet:', wallet);
console.log('Private Key:', wallet.privateKey);
console.log('Public Key:', wallet.publicKey);
console.log('Address:', wallet.address);
