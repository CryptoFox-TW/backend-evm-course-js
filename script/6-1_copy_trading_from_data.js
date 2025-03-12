require('dotenv').config();
const axios = require('axios');
const { ethers } = require('ethers');

// Load environment variables
const RPC_HTTP_URL = process.env.SEPOLIA_HTTP_RPC_URL;
const RPC_WSS_URL = process.env.SEPOLIA_WS_RPC_URL;
const TRACK_ADDRESS =
  '0xA8ff7CbE22046021a2977304472487eFcE68eb95'.toLowerCase();
const UNISWAP_V2_ROUTER_ADDRESS = '0xeE567Fe1712Faf6149d80dA1E6934E354124CfE3';
// WebSocket 初始化
function initWebSocketProvider() {}
