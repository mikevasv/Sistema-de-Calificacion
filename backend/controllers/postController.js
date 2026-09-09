const db = require('../src/config/db');
const { v4: uuidv4 } = require('uuid');

exports.getPosts = async (req, res) => {
  const { curso, catedratico } = req.query;

  try {
    let query = `
      SELECT 
        p.id,
        p.codigo_publicacion,
        p.carne,
        p.contenido,
        p.fecha,
        u.nombres,
        u.apellidos,
        c.nombre AS curso,
        cat.nombres AS catedratico_nombre,
        cat.apellidos AS catedratico_apellido
      FROM publicacion p
      JOIN usuario u ON p.carne = u.carne
      JOIN curso c ON p.codigo_curso = c.codigo_curso
      JOIN catedratico cat ON p.codigo_catedratico = cat.codigo_catedratico
      WHERE 1=1
    `;

    const params = [];

    if (curso) {
      query += ` AND c.nombre LIKE ?`;
      params.push(`%${curso}%`);
    }

    if (catedratico) {
      query += ` AND (cat.nombres LIKE ? OR cat.apellidos LIKE ?)`;
      params.push(`%${catedratico}%`, `%${catedratico}%`);
    }

    query += ` ORDER BY p.fecha DESC`;

    const [posts] = await db.query(query, params);

    // Obtener los comentarios correspondientes a cada publicación
    for (let post of posts) {
      const [comments] = await db.query(
        `SELECT com.id, com.contenido, com.fecha, u.nombres, u.apellidos
         FROM comentarios com
         JOIN usuario u ON com.carne = u.carne
         WHERE com.codigo_publicacion = ?
         ORDER BY com.fecha ASC`,
        [post.codigo_publicacion]
      );
      post.comentarios = comments;
    }

    res.json(posts);
  } catch (error) {
    console.error('Error al obtener publicaciones:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.createPost = async (req, res) => {
  const { carne, codigo_curso, codigo_catedratico, contenido } = req.body;
  const codigo_publicacion = uuidv4();
  try {
    await db.query(
      'INSERT INTO publicacion (codigo_publicacion, carne, codigo_curso, codigo_catedratico, contenido) VALUES (?, ?, ?, ?, ?)',
      [codigo_publicacion, carne, codigo_curso, codigo_catedratico, contenido]
    );
    res.status(201).json({ message: 'Publicación creada exitosamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.addComment = async (req, res) => {
  const { carne, codigo_publicacion, contenido } = req.body;
  try {
    await db.query(
      'INSERT INTO comentarios (carne, codigo_publicacion, contenido) VALUES (?, ?, ?)',
      [carne, codigo_publicacion, contenido]
    );
    res.status(201).json({ message: 'Comentario agregado' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};