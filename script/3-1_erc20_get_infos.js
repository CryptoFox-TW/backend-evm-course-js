require('dotenv').config();
const { Web3 } = require('web3');
const ERC20ABI = require('./abis/ERC20ABI.json');

// 檢查 RPC_URL 是否存在
if (!process.env.SEPOLIA_HTTP_RPC_URL) {
  throw new Error('Missing RPC_URL in .env file');
}

const web3 = new Web3(process.env.SEPOLIA_HTTP_RPC_URL);

// 讓 tokenAddress 透過環境變數設定，避免硬編碼
const tokenAddress =
  process.env.TOKEN_ADDRESS || '0x4f69C966a9D5fEf8809a42b18ab91B8698B4F3B2';

const tokenContract = new web3.eth.Contract(ERC20ABI, tokenAddress);

async function getTokenInfo() {
  try {
    const [name, symbol, decimals, totalSupply] = await Promise.all([
      tokenContract.methods.name().call(),
      tokenContract.methods.symbol().call(),
      tokenContract.methods.decimals().call(),
      tokenContract.methods.totalSupply().call(),
    ]);

    console.log('Token Name:', name);
    console.log('Token Symbol:', symbol);
    console.log('Token Decimals:', decimals);
    console.log('Token Total Supply:', BigInt(totalSupply).toString()); // 確保大數精度
  } catch (error) {
    console.error('Failed to fetch token info:', error.message || error);
  }
}

// 允許模組化
module.exports = { getTokenInfo };

// 若直接執行此檔案，則執行 getTokenInfo()
if (require.main === module) {
  getTokenInfo();
}
