const db = require('../src/config/db');

exports.getCourses = async (req, res) => {
  try {
    const [courses] = await db.query('SELECT * FROM curso ORDER BY nombre ASC');
    res.json(courses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getProfessors = async (req, res) => {
  try {
    const [professors] = await db.query('SELECT * FROM catedratico ORDER BY nombres ASC');
    res.json(professors);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};