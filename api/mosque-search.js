export default async function handler(req, res) {
  const { lat, lon, distance } = req.query;
  
  try {
    const response = await fetch(
      `https://mawaqit.net/api/2.0/mosque/search?lat=${lat}&lon=${lon}&distance=${distance}`
    );
    const data = await response.json();
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch mosques' });
  }
}