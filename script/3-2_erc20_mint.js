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

// 使用環境變數設定 Token Address
const tokenAddress =
  process.env.TOKEN_ADDRESS || '0x4f69C966a9D5fEf8809a42b18ab91B8698B4F3B2';

const senderAddress = process.env.ADDRESS;
const privateKey = process.env.PRIVATE_KEY;
const receiverAddress = process.env.ADDRESS;

const tokenContract = new web3.eth.Contract(ERC20ABI, tokenAddress);

// 取得代幣餘額
async function getBalance(address) {
  try {
    const balance = await tokenContract.methods.balanceOf(address).call();
    const decimals = await tokenContract.methods.decimals().call();
    return web3.utils.fromWei(balance, 'ether'); // 轉成人類可讀格式
  } catch (error) {
    console.error(`❌ 無法獲取 ${address} 餘額:`, error.message || error);
    return null;
  }
}

// Mint 代幣
async function mintTokens(toAddress, amount) {
  try {
    console.log('🚀 Mint 開始...');

    // Mint 前查詢餘額
    const balanceBefore = await getBalance(toAddress);
    console.log(`💰 Mint 前餘額: ${balanceBefore} tokens`);

    const mintData = tokenContract.methods.mint(toAddress, amount).encodeABI();

    // 並行獲取必要資訊
    const [nonce, maxPriorityFeePerGas, block] = await Promise.all([
      web3.eth.getTransactionCount(senderAddress, 'latest'),
      web3.eth.getMaxPriorityFeePerGas(),
      web3.eth.getBlock('latest'),
    ]);

    const maxFeePerGas =
      BigInt(block.baseFeePerGas) + BigInt(maxPriorityFeePerGas);

    const transaction = {
      to: tokenAddress,
      nonce,
      maxFeePerGas: maxFeePerGas.toString(),
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

    // Mint 後查詢餘額
    const balanceAfter = await getBalance(toAddress);
    console.log(`✅ Mint 後餘額: ${balanceAfter} tokens`);

    return receipt;
  } catch (error) {
    console.error('❌ Mint 失敗:', error.message || error);
    throw error;
  }
}

// 允許模組化使用
module.exports = { mintTokens, getBalance };

// 如果直接執行此文件，則執行 mintTokens
if (require.main === module) {
  const amount = web3.utils.toWei('100', 'ether'); // 100 tokens
  mintTokens(receiverAddress, amount)
    .then(() => console.log('🎉 Minting 成功！'))
    .catch((error) =>
      console.error('❌ Minting 失敗:', error.message || error)
    );
}
