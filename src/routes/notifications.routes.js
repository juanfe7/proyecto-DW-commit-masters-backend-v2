const express = require('express');
const router = express.Router();
const { getNotifications, createNotification, markAsRead } = require('../controllers/notifications.controller');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', authMiddleware, getNotifications); // Obtener notificaciones del usuario autenticado
router.post('/', authMiddleware, createNotification); // Crear una nueva notificación
router.patch('/:id/read', authMiddleware, markAsRead); // Marcar como leída

module.exports = router;
