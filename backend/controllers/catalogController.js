const db = require('../src/config/db');

// Obtener cursos
exports.getCourses = async (req, res) => {
  try {
    const [courses] = await db.query('SELECT * FROM curso ORDER BY nombre ASC');
    res.json(courses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Crear nuevo curso
exports.createCourse = async (req, res) => {
  const { codigo_curso, nombre, creditos } = req.body;
  try {
    if (!codigo_curso || !nombre || !creditos) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }
    await db.query(
      'INSERT INTO curso (codigo_curso, nombre, creditos) VALUES (?, ?, ?)',
      [codigo_curso, nombre, creditos]
    );
    return res.status(201).json({ message: 'Curso creado exitosamente' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Obtener catedráticos
exports.getProfessors = async (req, res) => {
  try {
    const [professors] = await db.query('SELECT * FROM catedratico ORDER BY nombres ASC');
    res.json(professors);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Crear nuevo catedrático
exports.createProfessor = async (req, res) => {
  const { codigo_catedratico, nombres, apellidos } = req.body;
  try {
    await db.query(
      'INSERT INTO catedratico (codigo_catedratico, nombres, apellidos) VALUES (?, ?, ?)',
      [codigo_catedratico, nombres, apellidos]
    );
    res.status(201).json({ message: 'Catedrático creado exitosamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};