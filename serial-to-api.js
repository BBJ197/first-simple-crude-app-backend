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
    const nfcId = line.trim();  // <<< define it OUTSIDE the try-catch
    console.log('NfcId received:', nfcId);

    try {
      let response = null;

      if (nfcId === '249.14.59.0') {
        console.log('Bamlakes id');
        response = await axiosInstance.get('http://localhost:3000/api/products/680d077673d2dcc9ffab62ba');
      } else if (nfcId === '153.190.187.2') {
        console.log('Jorge id');
        response = await axiosInstance.get('http://localhost:3000/api/products/680d07bb73d2dcc9ffab62bc');
      } else {
        console.log('Unknown id');
        response = { data: { message: 'Unknown NFC ID' } }; // handle unknown ids properly
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
      // Even in case of error, pass the nfcId safely
      callback(nfcId, { message: 'Error fetching data' });
    }
  });
}
