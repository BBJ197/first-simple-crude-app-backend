import { SerialPort, ReadlineParser } from 'serialport';
import axios from 'axios';
import https from 'https';

// Create an axios instance that ignores SSL errors (for local development)
const axiosInstance = axios.create({
  httpsAgent: new https.Agent({
    rejectUnauthorized: false // Ignore self-signed certificate errors
  })
});

export async function readNfcData(callback) {
  // Configure the serial port
  const port = new SerialPort({
    path: 'COM6', // Replace with your Arduino's port
    baudRate: 9600
  });

  const parser = port.pipe(new ReadlineParser({ delimiter: '\n' }));

  parser.on('data', async (line) => {
    try {
      const nfcId = line.trim();
      console.log('NfcId received:', nfcId);

      let response = null;

      if (nfcId === '249.14.59.0') {
        console.log('Bamlakes id');
        response = await axiosInstance.get('http://localhost:3000/api/products/6807e4fad92cbf1ff7e12ce7');
      } else if (nfcId === '8.148.121.79') {
        console.log('Jorge id');
        response = await axiosInstance.get('http://localhost:3000/api/products/6807c9e8f8954ae7712e38af');
      } else {
        console.log('Unknown id');
        response = { data: { message: 'Unknown NFC ID' } };
      }

      // Pass the NFC ID and response data to the callback
      callback(nfcId, response.data);
    } catch (err) {
      if (err.response) {
        console.error('HTTP Error:', err.response.status, err.response.data);
      } else if (err.request) {
        console.error('Network Error: No response from server');
      } else {
        console.error('Error:', err.message);
      }
      callback(nfcId, { message: 'Error fetching data' });
    }
  });
}