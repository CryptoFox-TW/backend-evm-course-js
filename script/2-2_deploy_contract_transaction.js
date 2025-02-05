require('dotenv').config();
const { ethers } = require('ethers');

// Load environment variables (set these in a .env file)
const PRIVATE_KEY = process.env.PRIVATE_KEY; // ⚠️ Keep it private!
const RPC_URL = process.env.SEPOLIA_RPC_URL; // Infura, Alchemy, or local node

async function main() {
  // Setup provider and wallet
  const provider = new ethers.JsonRpcProvider(RPC_URL);
  const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
  console.log(`Deploying from: ${wallet.address}`);

  // Contract ABI & Bytecode (Generated from Solidity Compiler)
  const CONTRACT_ABI = [
    'constructor(string memory _message)',
    'function number() public view returns (uint256)',
    'function setNumber(uint256 _newNumber) public',
    'function increment() public',
  ];

  const CONTRACT_BYTECODE =
    '0x6080604052348015600f57600080fd5b5060f78061001e6000396000f3fe6080604052348015600f57600080fd5b5060043610603c5760003560e01c80633fb5c1cb1460415780638381f58a146053578063d09de08a14606d575b600080fd5b6051604c3660046083565b600055565b005b605b60005481565b60405190815260200160405180910390f35b6051600080549080607c83609b565b9190505550565b600060208284031215609457600080fd5b5035919050565b60006001820160ba57634e487b7160e01b600052601160045260246000fd5b506001019056fea2646970667358221220091e48831e9eee32d4571d6291233a4fdaaa34b7dced8770f36f5368be825c5264736f6c63430008190033'; // Replace with actual bytecode

  // Define contract factory
  const contractFactory = new ethers.ContractFactory(
    CONTRACT_ABI,
    CONTRACT_BYTECODE,
    wallet
  );

  // Estimate gas required for deployment
  const estimatedGas = await provider.estimateGas(
    contractFactory.getDeployTransaction('Hello, Blockchain!')
  );
  console.log(`Estimated Gas: ${estimatedGas.toString()} units`);

  // Fetch current gas fees
  const feeData = await provider.getFeeData();
  const maxPriorityFeePerGas =
    feeData.maxPriorityFeePerGas || ethers.parseUnits('2', 'gwei');
  const maxFeePerGas = feeData.maxFeePerGas || ethers.parseUnits('30', 'gwei');

  const contract = await contractFactory.deploy('Hello, Blockchain!', {
    gasLimit: estimatedGas * BigInt(2), // Use estimated gas
    maxPriorityFeePerGas,
    maxFeePerGas,
  });

  console.log(`Transaction Hash: ${contract.deploymentTransaction().hash}`);

  // Wait for confirmation
  await contract.waitForDeployment();
  console.log(`Contract deployed at: ${await contract.getAddress()}`);
}

main().catch(console.error);
