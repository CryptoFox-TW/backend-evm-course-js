require('dotenv').config();
const { Web3 } = require('web3');
const ERC20ABI = require('./abis/ERC20ABI.json');

// 環境變數檢查
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
const tokenContract = new web3.eth.Contract(ERC20ABI, tokenAddress);

// 獲取 Gas 設定
async function getGasConfig() {
  const [maxPriorityFeePerGas, block] = await Promise.all([
    web3.eth.getMaxPriorityFeePerGas(),
    web3.eth.getBlock('latest'),
  ]);
  return {
    maxPriorityFeePerGas: maxPriorityFeePerGas.toString(),
    maxFeePerGas: (
      (BigInt(block.baseFeePerGas) * BigInt(12)) / BigInt(10) +
      BigInt(maxPriorityFeePerGas)
    ).toString(),
  };
}

// 發送交易
async function sendTransaction(data) {
  const nonce = await web3.eth.getTransactionCount(senderAddress, 'latest');
  const gasConfig = await getGasConfig();

  const transaction = {
    from: senderAddress,
    to: tokenAddress,
    nonce,
    data,
    ...gasConfig,
  };
  transaction.gas = await web3.eth.estimateGas(transaction);
  console.log('Transaction:', transaction);

  const signedTx = await web3.eth.accounts.signTransaction(
    transaction,
    privateKey
  );

  // 發送交易
  try {
    const receipt = await web3.eth.sendSignedTransaction(
      signedTx.rawTransaction
    );
    console.log('Transaction hash', receipt.transactionHash);
    return receipt;
  } catch (error) {
    console.error('Transaction failed:', error);
  }
}

// 取得 Token 資訊
async function getTokenInfo() {
  const [name, symbol, decimals, totalSupply] = await Promise.all([
    tokenContract.methods.name().call(),
    tokenContract.methods.symbol().call(),
    tokenContract.methods.decimals().call(),
    tokenContract.methods.totalSupply().call(),
  ]);
  console.log({
    name,
    symbol,
    decimals,
    totalSupply: BigInt(totalSupply).toString(),
  });
}

// Mint 代幣
async function mintErc20(toAddress, amount) {
  return sendTransaction(
    tokenContract.methods.mint(toAddress, amount).encodeABI()
  );
}

// 燒毀代幣
async function burnErc20(amount) {
  return sendTransaction(tokenContract.methods.burn(amount).encodeABI());
}

// 轉移代幣
async function transferErc20(toAddress, amount) {
  return sendTransaction(
    tokenContract.methods.transfer(toAddress, amount).encodeABI()
  );
}

// 授權代幣
async function approveErc20(spender, amount) {
  return sendTransaction(
    tokenContract.methods.approve(spender, amount).encodeABI()
  );
}

// 授權轉移代幣
async function transferFromErc20(from, to, amount) {
  return sendTransaction(
    tokenContract.methods.transferFrom(from, to, amount).encodeABI()
  );
}

// CLI 操作
async function main() {
  const [action, ...args] = process.argv.slice(2);

  switch (action) {
    case 'getTokenInfo':
      return getTokenInfo();
    case 'mint':
      return mintErc20(args[0], web3.utils.toWei(args[1], 'ether'));
    case 'burn':
      return burnErc20(web3.utils.toWei(args[0], 'ether'));
    case 'transfer':
      return transferErc20(args[0], web3.utils.toWei(args[1], 'ether'));
    case 'approve':
      return approveErc20(args[0], web3.utils.toWei(args[1], 'ether'));
    case 'transferFrom':
      return transferFromErc20(
        args[0],
        args[1],
        web3.utils.toWei(args[2], 'ether')
      );
    default:
      console.log(
        'Usage: node erc20.js [getTokenInfo | mint | burn | transfer | approve | transferFrom] [args...]'
      );
  }
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = {
  getTokenInfo,
  mintErc20,
  burnErc20,
  transferErc20,
  approveErc20,
  transferFromErc20,
};
