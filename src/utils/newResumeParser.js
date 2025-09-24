const axios = require('axios');

async function getResumeData(fileURL) {
  try {
      const response = await axios.post('http://127.0.0.1:5000/upload', {
        file_url: fileURL
      });
      return response?.data
    } catch (error) {
      console.error('Error sending POST request:', error);
    }
}

module.exports = getResumeData;
