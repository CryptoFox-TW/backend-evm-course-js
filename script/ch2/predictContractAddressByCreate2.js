const { ethers } = require('ethers');

// Uniswap V2 constants
const FACTORY_ADDRESS = '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f'; // Uniswap V2 Factory address
const INIT_CODE_HASH =
  '0x96e8ac4277198ff8b6f785478aa9a39f403cb768dd02cbee326c3e7da348845f'; // Uniswap V2 init code hash

// Token addresses (replace these with actual token addresses)
const tokenA = '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2';
const tokenB = '0x745B9cd66Af8Af1522078E6c85F558f4256a513A';

// Helper function to sort tokens
function sortTokens(tokenA, tokenB) {
  return tokenA.toLowerCase() < tokenB.toLowerCase()
    ? [tokenA, tokenB]
    : [tokenB, tokenA];
}

// Get the sorted token addresses
const [token0, token1] = sortTokens(tokenA, tokenB);

// Compute the salt as the Keccak256 hash of the two sorted token addresses
const salt = ethers.keccak256(
  ethers.solidityPacked(['address', 'address'], [token0, token1])
);

// Predict the pair address using CREATE2 formula
const pairAddress = ethers.getCreate2Address(
  FACTORY_ADDRESS, // The factory address
  salt, // The salt computed from token0 and token1
  INIT_CODE_HASH // The init code hash of the pair contract
);

console.log('Predicted Uniswap V2 Pair Address:', pairAddress);
