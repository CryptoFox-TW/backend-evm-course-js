require('dotenv').config();
const { Web3 } = require('web3');
const { Printer } = require('../src/utils');
const ERC20ABI = require('./abis/ERC20ABI.json');

// 檢查環境變數是否完整
if (
  !process.env.SEPOLIA_HTTP_RPC_URL ||
  !process.env.ADDRESS ||
  !process.env.PRIVATE_KEY
) {
  throw new Error(
    'Missing required environment variables: RPC_URL, ADDRESS, PRIVATE_KEY'
  );
}

const web3 = new Web3(process.env.SEPOLIA_HTTP_RPC_URL);

// 使用環境變數設定 Token Address，增加靈活性
const tokenAddress =
  process.env.TOKEN_ADDRESS || '0x4f69C966a9D5fEf8809a42b18ab91B8698B4F3B2';

const senderAddress = process.env.ADDRESS;
const privateKey = process.env.PRIVATE_KEY;
const receiverAddress = process.env.ADDRESS;

const tokenContract = new web3.eth.Contract(ERC20ABI, tokenAddress);

async function mintTokens(toAddress, amount) {
  try {
    const mintData = tokenContract.methods.mint(toAddress, amount).encodeABI();

    // 並行獲取必要資訊，提高效率
    const [nonce, gasPrice, maxPriorityFeePerGas, block] = await Promise.all([
      web3.eth.getTransactionCount(senderAddress, 'latest'),
      web3.eth.getGasPrice(),
      web3.eth.getMaxPriorityFeePerGas(),
      web3.eth.getBlock('latest'),
    ]);

    const maxFeePerGas =
      BigInt(block.baseFeePerGas) + BigInt(maxPriorityFeePerGas);

    const transaction = {
      to: tokenAddress,
      nonce,
      maxFeePerGas: maxFeePerGas.toString(), // 確保是 string，避免 BigInt 轉換問題
      maxPriorityFeePerGas: maxPriorityFeePerGas.toString(),
      data: mintData,
    };

    Printer.print('Transaction Data', transaction);

    const gasEstimate = await web3.eth.estimateGas(transaction);
    transaction.gas = gasEstimate;
    Printer.print('Gas Estimate', gasEstimate);

    // 簽署交易
    const signedTx = await web3.eth.accounts.signTransaction(
      transaction,
      privateKey
    );

    // 發送交易
    const receipt = await web3.eth.sendSignedTransaction(
      signedTx.rawTransaction
    );
    Printer.print('Transaction Receipt', receipt);

    return receipt;
  } catch (error) {
    console.error('Error minting tokens:', error.message || error);
    throw error; // 確保錯誤會拋出，方便調試
  }
}

// 允許模組化使用
module.exports = { mintTokens };

// 如果直接執行此文件，則執行 mintTokens
if (require.main === module) {
  mintTokens(receiverAddress, web3.utils.toWei('100', 'ether'))
    .then(() => console.log('Minting successful!'))
    .catch((error) => console.error('Minting failed:', error.message || error));
}
