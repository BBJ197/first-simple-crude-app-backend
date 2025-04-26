import express from 'express';
import { readNfcData } from './serial-to-api.js';

const app = express();
const port = 3001; // Changed from 3000 to 3001

// Serve static files (HTML, images, etc.) from a 'public' folder
app.use(express.static('public'));

// Store the latest API response (including image)
let latestResponse = { nfcId: 'Unknown', data: null };

// API endpoint to get the latest NFC response
app.get('/api/nfc', (req, res) => {
  res.json(latestResponse);
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

// Update the latest response when new NFC data is received
readNfcData((nfcId, responseData) => {
  latestResponse = { nfcId, data: responseData };
});