require('dotenv').config();
const { ethers } = require('ethers');

// 加載環境變數
const RPC_WSS_URL = process.env.MAINNET_WS_RPC_URL; // WebSocket RPC (用來監聽事件)
const TOKEN_ADDRESS = '0xdAC17F958D2ee523a2206206994597C13D831ec7'; // ERC-20 合約地址

// 設置 WebSocket 供監聽事件
const wsProvider = new ethers.WebSocketProvider(RPC_WSS_URL);

console.log(`🔍 監聽 ${TOKEN_ADDRESS} 的 Transfer 事件...`);

wsProvider.on(
  {
    address: TOKEN_ADDRESS,
    topics: [ethers.id('Transfer(address,address,uint256)')],
  },
  (log, event) => {
    try {
      console.log(JSON.stringify(log, null, 2));

      const blockNumber = log.blockNumber;
      const txHash = log.transactionHash;
      const from = ethers.getAddress('0x' + log.topics[1].slice(26));
      const to = ethers.getAddress('0x' + log.topics[2].slice(26));
      const value = ethers.toBigInt(log.data);

      console.log(`📌 在區塊 ${blockNumber} 檢測到 Transfer 事件`);
      console.log(`🔹 來源: ${from}`);
      console.log(`🔹 目的: ${to}`);
      console.log(`💰 數量: ${ethers.formatUnits(value, 6)} Tokens`);
      console.log(`🔗 交易: ${txHash}`);
      console.log('----------------------------');
    } catch (error) {
      console.error('❌ Error handling Transfer event:', error);
    }
  }
);
