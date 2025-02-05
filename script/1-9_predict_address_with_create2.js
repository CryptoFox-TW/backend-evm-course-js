const { ethers } = require('ethers');

async function predictCreate2Address(deployerAddress, salt, bytecode) {
  const bytecodeHash = ethers.keccak256(bytecode);

  const encodedData = ethers.AbiCoder.defaultAbiCoder().encode(
    ['bytes1', 'address', 'bytes32', 'bytes32'],
    ['0xff', deployerAddress, salt, bytecodeHash]
  );

  const predictedAddress = '0x' + ethers.keccak256(encodedData).slice(-40);

  console.log(`🔹 Predicted CREATE2 Address: ${predictedAddress}`);
}

// Example Usage
const deployer = '0xYourDeployerAddressHere'; // Replace with actual deployer address
const salt = ethers.keccak256(ethers.toUtf8Bytes('custom_salt')); // Any unique salt
const bytecode = '0x60806040...'; // Replace with actual contract bytecode

predictCreate2Address(deployer, salt, bytecode);
