require('dotenv').config();
const { Web3 } = require('web3');
const { Printer } = require('../src/utils');
const ERC20ABI = require('./abis/ERC20ABI.json');

// 確保環境變數已設定
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
const tokenAddress =
  process.env.TOKEN_ADDRESS || '0x4f69C966a9D5fEf8809a42b18ab91B8698B4F3B2';
const senderAddress = process.env.ADDRESS;
const privateKey = process.env.PRIVATE_KEY;
const receiverAddress = process.env.ADDRESS;

// 創建 ERC20 合約實例
const tokenContract = new web3.eth.Contract(ERC20ABI, tokenAddress);

async function transferTokens(toAddress, amount) {
  try {
    const transferData = tokenContract.methods
      .transfer(toAddress, amount)
      .encodeABI();

    // 併發獲取交易所需資訊
    const [nonce, gasPrice, maxPriorityFeePerGas, block] = await Promise.all([
      web3.eth.getTransactionCount(senderAddress, 'latest'),
      web3.eth.getGasPrice(),
      web3.eth.getMaxPriorityFeePerGas(),
      web3.eth.getBlock('latest'),
    ]);

    // 計算 maxFeePerGas
    const maxFeePerGas =
      BigInt(block.baseFeePerGas) + BigInt(maxPriorityFeePerGas);

    const transaction = {
      from: senderAddress,
      to: toAddress, // ✅ 這裡修正為接收者地址，而不是合約地址
      nonce,
      maxFeePerGas: maxFeePerGas.toString(),
      maxPriorityFeePerGas: maxPriorityFeePerGas.toString(),
      data: transferData,
    };

    Printer.print('Transaction Data', transaction);

    // 預估 gas
    let gasEstimate;
    try {
      gasEstimate = await web3.eth.estimateGas(transaction);
      transaction.gas = gasEstimate;
      Printer.print('Gas Estimate', gasEstimate);
    } catch (error) {
      console.error('Gas estimation failed:', error);
      return;
    }

    // 簽名交易
    const signedTx = await web3.eth.accounts.signTransaction(
      transaction,
      privateKey
    );

    // 發送交易
    try {
      const receipt = await web3.eth.sendSignedTransaction(
        signedTx.rawTransaction
      );
      Printer.print('Transaction Receipt', receipt);
      return receipt;
    } catch (error) {
      console.error('Transaction failed:', error);
    }
  } catch (error) {
    console.error('Error transferring tokens:', error.message || error);
    throw error;
  }
}

// 允許模組化使用
module.exports = { transferTokens };

// 如果直接執行此文件，則執行 transferTokens
if (require.main === module) {
  transferTokens(receiverAddress, web3.utils.toWei('10', 'ether'))
    .then(() => console.log('Transfer successful!'))
    .catch((error) =>
      console.error('Transfer failed:', error.message || error)
    );
}
