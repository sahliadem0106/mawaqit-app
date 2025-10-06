export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  const { id } = req.query;
  
  if (!id) {
    return res.status(400).json({ error: 'Missing mosque ID' });
  }
  
  try {
    const response = await fetch(
      `https://mawaqit.net/api/2.0/mosque/${id}`,
      {
        headers: {
          'User-Agent': 'Mozilla/5.0'
        }
      }
    );
    
    if (!response.ok) {
      throw new Error(`API returned ${response.status}`);
    }
    
    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error('Mosque details error:', error);
    res.status(500).json({ error: error.message });
  }
}