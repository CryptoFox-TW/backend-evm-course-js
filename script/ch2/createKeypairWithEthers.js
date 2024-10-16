import { ethers } from 'ethers';

/*
 * ---------------------------------------------------
 * Phrase1: Generate a wallet
 * ---------------------------------------------------
 */
const wallet = ethers.Wallet.createRandom();
console.log('Wallet:', wallet);

/*
 * ---------------------------------------------------
 * Phrase2: Get the private key, public key, and address
 * ---------------------------------------------------
 */
console.log('Private Key:', wallet.privateKey);
console.log('Public Key:', wallet.publicKey);
console.log('Address:', wallet.address);
