const { db } = require('../config/firebase');


const getNotifications = async (req, res) => {
  try {
    const email = req.user.email;// Obtener el email del usuario autenticado desde el token JWT
    const snapshot = await db.collection('notifications')
      .where('email', '==', email)
      .orderBy('createdAt', 'desc')
      .get();

    const notifications = snapshot.docs.map(doc => ({// Mapear los documentos a un formato más manejable
      id: doc.id,// ID de la notificación
      ...doc.data()// Obtener los datos de la notificación
    }));

    res.status(200).json(notifications);
  } catch (error) {
    console.error('Error al obtener notificaciones:', error);
    res.status(500).json({ message: 'Error al obtener notificaciones' });
  }
};


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

    await db.collection('notifications').add(newNotification);// Agregar la nueva notificación a la colección 'notifications'

    res.status(201).json({ message: 'Notificación creada' });
  } catch (error) {
    console.error('Error al crear notificación:', error);
    res.status(500).json({ message: 'Error al crear notificación' });
  }
};


// PATCH - marcar como leída
const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;// Obtener el ID de la notificación desde los parámetros de la solicitud

    if (!id) {
      return res.status(400).json({ message: 'ID de notificación requerido' });
    }

    const ref = db.collection('notifications').doc(id);// Obtener la referencia al documento de la notificación
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
