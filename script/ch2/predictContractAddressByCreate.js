import { ethers } from 'ethers';
import rlp from 'rlp';

// Example contract address (the contract creating the new contract) and its nonce
const creatorAddress = '0x6A4481Eb81B9772b992aE58c429d508F5273b823';
const nonce = 1; // Replace with the correct nonce (number of contracts the creator has deployed)

// RLP encode [creator_address, creator_nonce]
const encoded = rlp.encode([creatorAddress, nonce]);

// Hash the encoded data using keccak256
const hash = ethers.keccak256(encoded);

// The contract address is the last 20 bytes of the hash
const contractAddress = '0x' + hash.slice(26);

console.log('Predicted Contract Address:', contractAddress);
