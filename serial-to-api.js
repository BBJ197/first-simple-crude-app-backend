import { SerialPort, ReadlineParser } from 'serialport';
import axios from 'axios';
import https from 'https';

var n=0;
var j=0;
const axiosInstance = axios.create({
  httpsAgent: new https.Agent({
    rejectUnauthorized: false 
  })
});

export async function readNfcData(callback) {
 
  const port = new SerialPort({
    path: 'COM6', 
    baudRate: 9600
  });

  const parser = port.pipe(new ReadlineParser({ delimiter: '\n' }));

  parser.on('data', async (line) => {
    const nfcId = line.trim(); 
    console.log('NfcId received:', nfcId);

    try {
      let response = null;

      if (nfcId === '249.14.59.0') {
        console.log('Bamlakes id');
        response = await axiosInstance.get('http://localhost:3000/api/products/680d077673d2dcc9ffab62ba');
        response.data.message= "Success";
        n+=1;
        if (n > 1) {
          console.log('Bamlakes id called more than once');
        //  response = await axiosInstance.get('http://localhost:3000/api/products/680d077673d2dcc9ffab62ba');
          response.data.message= "Duplicate"; 
        }
      } else if (nfcId === '153.190.187.2') {
        console.log('Jorge id');
        response = await axiosInstance.get('http://localhost:3000/api/products/680d07bb73d2dcc9ffab62bc');
        response.data.message= "Success";
        j+=1;
        if (j > 1) {
          console.log('Bamlakes id called more than once');
        //  response = await axiosInstance.get('http://localhost:3000/api/products/680d077673d2dcc9ffab62ba');
          response.data.message= "Duplicate"; 
        }
        
      } else {
        console.log('Unknown id');
        response = { data: { message: 'Unknown NFC ID' } }; 
      }


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
