const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');
const postController = require('../controllers/postController');
const profileController = require('../controllers/profileController');
const catalogController = require('../controllers/catalogController');

// Rutas de Autenticación
router.post('/auth/register', authController.register);
router.post('/auth/login', authController.login);
router.post('/auth/recover', authController.recoverPassword);

// Rutas de Publicaciones
router.get('/posts', postController.getPosts);
router.post('/posts', postController.createPost);
router.post('/posts/comments', postController.addComment);

// Rutas de Catálogos
router.get('/courses', catalogController.getCourses);
router.post('/courses', catalogController.createCourse);
router.get('/professors', catalogController.getProfessors);
router.post('/professors', catalogController.createProfessor);

// Rutas de Perfil y Cursos Aprobados
router.get('/users/:carne', profileController.getProfile);
router.put('/users/:carne', profileController.updateProfile);
router.post('/users/:carne/courses', profileController.addApprovedCourse);
router.delete('/users/:carne/courses/:id', profileController.deleteApprovedCourse);

module.exports = router;