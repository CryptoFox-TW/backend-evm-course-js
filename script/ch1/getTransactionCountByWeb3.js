require('dotenv').config();
const { Printer } = require('../../src/utils');

const { Web3 } = require('web3');
const web3 = new Web3(process.env.MAINNET_INFURA_URL);

const eoaAddress = '0x6A4481Eb81B9772b992aE58c429d508F5273b823';
const contractWithoutDeploy = '0xD91A69C3453A884deF888e777cF14652C6a24d9E';
const contractWithDeploy = '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f';

async function getTransactionCount(address) {
  const nonce = await web3.eth.getTransactionCount(address);
  return nonce;
}

(async () => {
  const eoaAddressNonce = await getTransactionCount(eoaAddress);
  const contractWithoutDeployNonce = await getTransactionCount(
    contractWithoutDeploy
  );
  const contractWithDeployNonce = await getTransactionCount(contractWithDeploy);

  Printer.print('Nonces:', {
    eoaAddressNonce,
    contractWithoutDeployNonce,
    contractWithDeployNonce,
  });
})();
