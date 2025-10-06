const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

const MAWAQIT_API_BASE = 'https://mawaqit.net/api/2.0';

// Proxy endpoint for mosque search
app.get('/api/mosque/search', async (req, res) => {
  try {
    const { lat, lon, distance } = req.query;
    const url = `${MAWAQIT_API_BASE}/mosque/search?lat=${lat}&lon=${lon}&distance=${distance}`;
    
    console.log('Proxying mosque search to:', url);
    
    const response = await fetch(url);
    const text = await response.text();
    
    if (text.startsWith('<!DOCTYPE') || text.startsWith('<html')) {
      return res.status(500).json({ error: 'API returned HTML error page' });
    }
    
    const data = JSON.parse(text);
    console.log('Successfully fetched', data.length || 0, 'mosques');
    res.json(data);
    
  } catch (error) {
    console.error('Proxy error in mosque search:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Keep the server alive
app.listen(PORT, () => {
  console.log(`\n✅ Proxy server running on http://localhost:${PORT}`);
  console.log('Ready to proxy Mawaqit mosque search requests\n');
  console.log('📝 Note: Prayer time details are not available through the public API');
  console.log('   Users will be directed to the Mawaqit website for full details\n');
});

// Prevent the server from crashing
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error.message);
});

process.on('unhandledRejection', (error) => {
  console.error('Unhandled Rejection:', error.message);
});