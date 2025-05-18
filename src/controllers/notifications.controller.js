const { db } = require('../config/firebase');

// GET - obtener notificaciones del usuario
const getNotifications = async (req, res) => {
  try {
    const email = req.user.email;
    const snapshot = await db.collection('notifications')
      .where('email', '==', email)
      .orderBy('createdAt', 'desc')
      .get();

    const notifications = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    res.status(200).json(notifications);
  } catch (error) {
    console.error('Error al obtener notificaciones:', error);
    res.status(500).json({ message: 'Error al obtener notificaciones' });
  }
};

// POST - crear notificación
const createNotification = async (req, res) => {
  try {
    const { email, message } = req.body;

    if (!email || !message) {
      return res.status(400).json({ message: 'Faltan campos obligatorios' });
    }

    const newNotification = {
      email,
      message,
      read: false,
      createdAt: new Date().toISOString(),
    };

    await db.collection('notifications').add(newNotification);

    res.status(201).json({ message: 'Notificación creada' });
  } catch (error) {
    console.error('Error al crear notificación:', error);
    res.status(500).json({ message: 'Error al crear notificación' });
  }
};


// PATCH - marcar como leída
const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;

    const ref = db.collection('notifications').doc(id);
    await ref.update({ read: true });

    res.status(200).json({ message: 'Notificación marcada como leída' });
  } catch (error) {
    console.error('Error al marcar notificación como leída:', error);
    res.status(500).json({ message: 'Error al marcar como leída' });
  }
};

module.exports = {
  getNotifications,
  createNotification,
  markAsRead,
};
