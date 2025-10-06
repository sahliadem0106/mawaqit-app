export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Handle OPTIONS request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  const { lat, lon, distance } = req.query;
  
  // Validate parameters
  if (!lat || !lon) {
    return res.status(400).json({ error: 'Missing lat or lon parameters' });
  }
  
  try {
    const url = `https://mawaqit.net/api/2.0/mosque/search?lat=${lat}&lon=${lon}&distance=${distance || 1}`;
    
    console.log('Fetching from Mawaqit API:', url);
    
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Mawaqit API responded with status: ${response.status}`);
    }
    
    const text = await response.text();
    
    // Check if response is HTML (error page)
    if (text.startsWith('<!DOCTYPE') || text.startsWith('<html')) {
      console.error('Mawaqit API returned HTML error page');
      return res.status(500).json({ error: 'API returned HTML error page' });
    }
    
    const data = JSON.parse(text);
    console.log(`Successfully fetched ${data.length || 0} mosques`);
    
    res.status(200).json(data);
    
  } catch (error) {
    console.error('Proxy error:', error.message);
    res.status(500).json({ 
      error: 'Failed to fetch mosques',
      details: error.message 
    });
  }
}