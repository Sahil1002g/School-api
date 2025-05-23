const express = require('express');
const router = express.Router();
const db = require('../db');

// Add School
router.post('/addSchool', async (req, res) => {
  const { name, address, latitude, longitude } = req.body;
  if (!name || !address || isNaN(latitude) || isNaN(longitude)) {
    return res.status(400).json({ error: 'Invalid input data' });
  }

  try {
    await db.execute(
      'INSERT INTO schools (name, address, latitude, longitude) VALUES (?, ?, ?, ?)',
      [name, address, latitude, longitude]
    );
    res.json({ message: 'School added successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// List Schools by Proximity
router.get('/listSchools', async (req, res) => {
  const { latitude, longitude } = req.query;

  if (isNaN(latitude) || isNaN(longitude)) {
    return res.status(400).json({ error: 'Invalid coordinates' });
  }

  try {
    const [schools] = await db.execute('SELECT * FROM schools');
    const userLat = parseFloat(latitude);
    const userLng = parseFloat(longitude);

    const sortedSchools = schools.map(school => {
      const dist = Math.sqrt(
        Math.pow(userLat - school.latitude, 2) +
        Math.pow(userLng - school.longitude, 2)
      );
      return { ...school, distance: dist };
    }).sort((a, b) => a.distance - b.distance);

    res.json(sortedSchools);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
