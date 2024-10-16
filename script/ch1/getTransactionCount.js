import axios from 'axios';

const account = '0x95222290DD7278Aa3Ddd389Cc1E1d165CC4BAfe5';

const data = JSON.stringify({
  id: 1,
  jsonrpc: '2.0',
  method: 'eth_getTransactionCount',
  params: [account, 'latest'],
});

const config = {
  method: 'post',
  url: 'https://eth.llamarpc.com',
  headers: {
    'Content-Type': 'application/json',
  },
  data: data,
};

axios
  .request(config)
  .then((response) => {
    console.log(JSON.stringify(response.data));
  })
  .catch((error) => {
    console.error(error);
  });
