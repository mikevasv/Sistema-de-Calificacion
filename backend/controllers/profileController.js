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
  try {
    await db.query(
      'INSERT INTO cursos_aprobados (carne, codigo_curso, nota) VALUES (?, ?, ?)',
      [carne, codigo_curso, nota]
    );
    res.status(201).json({ message: 'Curso agregado al expediente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
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