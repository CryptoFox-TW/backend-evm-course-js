const axios = require('axios');

class RequestHelper {
  static async get({
    urls,
    headers = {},
    timeout = 5000,
    retries = 3,
    retryInterval = 1000,
  }) {
    try {
      for (let i = 0; i < retries; i++) {
        try {
          let url = urls[i % urls.length];
          const response = await axios.get(url, { headers, timeout });
          return response.data;
        } catch (error) {
          if (i === retries - 1) {
            throw error;
          }
          await new Promise((resolve) => setTimeout(resolve, retryInterval));
        }
      }
    } catch (error) {
      throw error;
    }
  }

  static async post({
    urls,
    headers = {},
    data = {},
    timeout = 5000,
    retries = 3,
    retryInterval = 1000,
  }) {
    try {
      for (let i = 0; i < retries; i++) {
        try {
          let url = urls[i % urls.length];
          const response = await axios.post(url, data, { headers, timeout });
          return response.data;
        } catch (error) {
          if (i === retries - 1) {
            throw error;
          }
          await new Promise((resolve) => setTimeout(resolve, retryInterval));
        }
      }
    } catch (error) {
      throw error;
    }
  }
}
