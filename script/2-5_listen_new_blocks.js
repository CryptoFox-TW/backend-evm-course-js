require('dotenv').config();
const { ethers } = require('ethers');

// 環境變數
const RPC_WSS_URL = process.env.SEPOLIA_WS_RPC_URL;
const TRACK_ADDRESS =
  '0x26aDF778004B8d449a5bE0192A2DcF86acb13bE5'.toLowerCase();

// 設定 WebSocket provider
const provider = new ethers.WebSocketProvider(RPC_WSS_URL, 11155111);

console.log(`🔍 正在監聽新區塊，追蹤交易地址: ${TRACK_ADDRESS}...`);

// Sleep function (確保 setTimeout 正常運作)
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// 監聽新區塊
provider.on('block', async (blockNumber) => {
  try {
    const block = await provider.getBlock(blockNumber);
    if (!block || !block.transactions) return;

    console.log(
      `🔗 新區塊: ${blockNumber}，交易數量: ${block.transactions.length}`
    );

    for (const txHash of block.transactions) {
      try {
        const tx = await provider.getTransaction(txHash);
        if (!tx) continue;

        console.log(`📌 交易哈希: ${tx.hash}`);
        console.log(`🔹 發送者: ${tx.from}`);
        console.log(`🔹 接收者: ${tx.to}`);
        console.log(`💰 數量: ${ethers.formatEther(tx.value)} ETH`);
        console.log(
          `⛽ 燃料價格: ${ethers.formatUnits(tx.gasPrice, 'gwei')} Gwei`
        );
        console.log('----------------------------');

        // 延遲 1 秒，避免過載
        await sleep(1000);
      } catch (txError) {
        console.error(`🚨 獲取交易 ${txHash} 失敗:`, txError);
      }
    }
  } catch (blockError) {
    console.error('❌ 無法獲取區塊數據:', blockError);
  }
});
