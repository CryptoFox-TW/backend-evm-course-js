require('dotenv').config();

const sednerPrivateKey = process.env.SENDER_PRIVATE_KEY;
const senderAddress = process.env.SENDER_ADDRESS;
const rpc = process.env.RPC_URL;

module.exports = {
  sednerPrivateKey,
  senderAddress,
  rpc,
};
