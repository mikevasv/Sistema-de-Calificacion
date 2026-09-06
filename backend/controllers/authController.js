const db = require('../src/config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  const { carne, nombres, apellidos, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await db.query(
      'INSERT INTO usuario (carne, nombres, apellidos, email, password) VALUES (?, ?, ?, ?, ?)',
      [carne, nombres, apellidos, email, hashedPassword]
    );
    res.status(201).json({ message: 'Usuario registrado exitosamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.login = async (req, res) => {
  const { carne, password } = req.body;
  try {
    const [rows] = await db.query('SELECT * FROM usuario WHERE carne = ?', [carne]);
    if (rows.length === 0) return res.status(404).json({ error: 'Usuario no encontrado' });

    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: 'Credenciales inválidas' });

    const token = jwt.sign({ carne: user.carne, email: user.email }, process.env.JWT_SECRET, { expiresIn: '8h' });
    res.json({ token, user: { carne: user.carne, nombres: user.nombres, apellidos: user.apellidos, email: user.email } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.recoverPassword = async (req, res) => {
  const { carne, email, newPassword } = req.body;
  try {
    const [rows] = await db.query('SELECT * FROM usuario WHERE carne = ? AND email = ?', [carne, email]);
    if (rows.length === 0) return res.status(404).json({ error: 'Datos de validación incorrectos' });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await db.query('UPDATE usuario SET password = ? WHERE carne = ?', [hashedPassword, carne]);
    res.json({ message: 'Contraseña actualizada correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};