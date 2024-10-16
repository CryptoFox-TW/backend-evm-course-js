import { ethers } from 'ethers';
import rlp from 'rlp';

// Example EOA address and nonce (replace with your data)
const senderAddress = '0x6A4481Eb81B9772b992aE58c429d508F5273b823';
const nonce = 0; // Replace with the correct nonce

// RLP encode [sender, nonce]
const encoded = rlp.encode([senderAddress, nonce]);
console.log('Encoded:', Buffer.from(encoded).toString('hex'));

// Hash the encoded data using keccak256
const hash = ethers.keccak256(encoded);
console.log('Hash:', hash);

// The contract address is the last 20 bytes of the hash
const contractAddress = '0x' + hash.slice(26);
console.log('Predicted Contract Address:', contractAddress);
