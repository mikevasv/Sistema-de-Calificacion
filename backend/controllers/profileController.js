const db = require('../src/config/db');

// Obtener información completa de un usuario por su carné
exports.getProfile = async (req, res) => {
  const { carne } = req.params;
  try {
    const [userRows] = await db.query(
      'SELECT carne, nombres, apellidos, email FROM usuario WHERE carne = ?',
      [carne]
    );

    if (userRows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    const [coursesRows] = await db.query(
      `SELECT ca.id, ca.codigo_curso, c.nombre, c.creditos, ca.nota 
       FROM cursos_aprobados ca
       JOIN curso c ON ca.codigo_curso = c.codigo_curso
       WHERE ca.carne = ?`,
      [carne]
    );

    res.json({
      usuario: userRows[0],
      cursosAprobados: coursesRows
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Actualizar datos del perfil (Nombres, Apellidos, Email)
exports.updateProfile = async (req, res) => {
  const { carne } = req.params;
  const { nombres, apellidos, email } = req.body;
  try {
    await db.query(
      'UPDATE usuario SET nombres = ?, apellidos = ?, email = ? WHERE carne = ?',
      [nombres, apellidos, email, carne]
    );
    res.json({ message: 'Perfil actualizado exitosamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Agregar un curso aprobado al expediente
exports.addApprovedCourse = async (req, res) => {
  const { carne } = req.params;
  const { codigo_curso, nota } = req.body;

  if (!codigo_curso || nota === undefined) {
    return res.status(400).json({ error: 'El código del curso y la nota son obligatorios.' });
  }

  try {
    // Validar si el curso existe en el catálogo antes de insertar
    const [courseExists] = await db.query(
      'SELECT codigo_curso FROM curso WHERE codigo_curso = ?',
      [codigo_curso]
    );

    if (courseExists.length === 0) {
      return res.status(404).json({ error: `El curso con código '${codigo_curso}' no existe en el catálogo.` });
    }

    // Insertar curso aprobado
    await db.query(
      'INSERT INTO cursos_aprobados (carne, codigo_curso, nota) VALUES (?, ?, ?)',
      [carne, codigo_curso, parseFloat(nota)]
    );

    return res.status(201).json({ message: 'Curso aprobado agregado correctamente.' });
  } catch (error) {
    console.error('Error al agregar curso aprobado:', error);
    return res.status(500).json({ error: error.message });
  }
};

// Eliminar un curso aprobado del expediente
exports.deleteApprovedCourse = async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM cursos_aprobados WHERE id = ?', [id]);
    res.json({ message: 'Curso eliminado del expediente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};