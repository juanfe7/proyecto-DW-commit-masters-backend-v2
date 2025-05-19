const { db } = require('../config/firebase');

const createOrder = async (req, res) => {
  const { products} = req.body;
  const email = req.user.email;
  const name = req.user.name;

  if (!products || !Array.isArray(products)) {// Verificar si products es un array
    return res.status(400).json({ message: 'Datos incompletos' });
  }

  try {
    // Buscar al cliente por su email
    const userSnapshot = await db.collection('users').where('email', '==', email).get();
    if (userSnapshot.empty) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const userDoc = userSnapshot.docs[0];// Obtener el primer documento que coincide con la consulta
    const userData = userDoc.data();// Obtener los datos del usuario


    let total = 0;
    const batch = db.batch(); // Crear un batch para realizar múltiples operaciones atómicas
    const detailedProducts = [];

    for (const item of products) {
      const { id, quantity } = item;
      if (!id || !quantity || quantity <= 0) {
        return res.status(400).json({ message: 'Datos de producto inválidos' });
      }

      const snapshot = await db.collection('products').where('id', '==', Number(id)).get();
      if (snapshot.empty) {
        return res.status(404).json({ message: `Producto con id ${id} no encontrado` });
      }

      const doc = snapshot.docs[0];
      const data = doc.data();

      if (data.stock < quantity) {
        return res.status(400).json({ message: `Stock insuficiente para el producto ${data.name}` });
      }

      // Acumular precio total
      total += data.price * quantity;

      // Restar stock (en batch)
      const productRef = db.collection('products').doc(doc.id);// Obtener la referencia al documento del producto
      batch.update(productRef, { stock: data.stock - quantity });// Actualizar el stock del producto

      detailedProducts.push({
        id: data.id,
        name: data.name,
        quantity,
        unitPrice: data.price,
        totalPrice: data.price * quantity,
        location: data.location
      });
    }

    // Verificar si el usuario tiene saldo suficiente
    if (userData.salary < total) {
      return res.status(400).json({ message: 'Saldo insuficiente para realizar esta orden' });
    }

    // Descontar saldo del usuario
    const userRef = db.collection('users').doc(userDoc.id);
    batch.update(userRef, { salary: userData.salary - total });

    const orderRef = db.collection('orders').doc();
    const orderId = orderRef.id;

    // Crear orden
    const newOrder = {
      email,
      products: detailedProducts,
      status: 'en confirmacion',
      total,
      createdAt: new Date(),
      name
    };

    batch.set(orderRef, newOrder);

    // Ejecutar batch
    await batch.commit();

    res.status(201).json({ message: 'Orden creada con éxito', id: orderRef.id });
  } catch (error) {
    console.error('Error al crear orden:', error);
    res.status(500).json({ message: 'Error al procesar la orden' });
  }
};


const getAllOrders = async (req, res) => {
  const { status } = req.query;

  try {
    let query = db.collection('orders').orderBy('createdAt', 'desc');// Ordenar por fecha de creación
    
    // Si se especificó el estado, agregarlo a la consulta
    if (status) {
      query = query.where('status', '==', status);
    }

    const snapshot = await query.get();

    if (snapshot.empty) {
      return res.status(404).json({ message: 'No se encontraron órdenes' });
    }

    const orders = snapshot.docs.map(doc => ({// Obtener los documentos y mapearlos a un formato más manejable
      id: doc.id,
      ...doc.data()
    }));

    return res.status(200).json(orders);
  } catch (error) {
    console.error('Error al obtener todas las órdenes:', error);
    return res.status(500).json({ message: 'Error del servidor' });
  }
};



const getOrderStatus = async (req, res) => {
  const orderId = req.params.id;

  if (!orderId || orderId.trim() === '') {// Verificar si el ID de la orden es válido
    return res.status(400).json({ message: 'ID de orden inválido' });
  }

  try {
    const orderRef = db.collection('orders').doc(orderId);//
    const orderSnap = await orderRef.get();

    if (!orderSnap.exists) {
      return res.status(404).json({ message: 'Orden no encontrada' });
    }

    const data = orderSnap.data();
    return res.status(200).json({ status: data.status });
  } catch (error) {
    console.error('Error al obtener estado de orden:', error);
    return res.status(500).json({ message: 'Error del servidor' });
  }
};


const getOrders = async (req, res) => {
  const { email } = req.user;
  const { status } = req.query;// Obtener el estado de la orden desde los parámetros de la consulta

  try {
    let query = db.collection('orders').where('email', '==', email);// Filtrar por email

    query = query.orderBy('createdAt', 'desc');

    // Si se especificó el estado, agregarlo a la consulta
    if (status) {
      query = query.where('status', '==', status);
    }

    const ordersSnapshot = await query.get();

    if (ordersSnapshot.empty) {
      return res.status(404).json({ message: 'No se encontraron órdenes' });
    }
    
    // Mapear los documentos a un formato más manejable
    const orders = ordersSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return res.status(200).json(orders);
  } catch (error) {
    console.error('Error al obtener órdenes:', error);
    return res.status(500).json({ message: 'Error del servidor' });
  }
};



const updateOrderStatus = async (req, res) => {
  const orderId = req.params.id;// Obtener el ID de la orden desde los parámetros de la solicitud
  const { status } = req.body;

  if (!status) {
    return res.status(400).json({ message: 'Falta el nuevo estado de la orden' });
  }

  try {
    const orderRef = db.collection('orders').doc(orderId);
    const orderSnap = await orderRef.get();

    if (!orderSnap.exists) {
      return res.status(404).json({ message: 'Orden no encontrada' });
    }

    // Obtener los datos de la orden
    const orderData = orderSnap.data();

    // Actualizar el estado
    await orderRef.update({ status });

    // Crear la notificación
    await db.collection('notifications').add({
      email: orderData.email || 'cliente@desconocido.com',
      message: `Tu pedido ha sido actualizado a: ${status}`,
      read: false,
      createdAt: new Date().toISOString(),
    });

    return res.status(200).json({ message: 'Estado de la orden actualizado con éxito y notificación enviada' });
  } catch (error) {
    console.error('Error al actualizar el estado:', error);
    return res.status(500).json({ message: 'Error del servidor' });
  }
};



const getOrderHistory = async (req, res) => {
  const { email } = req.user;

  try {
    const ordersSnapshot = await db.collection('orders')
      .where('email', '==', email)
      .orderBy('createdAt', 'desc') 
      .get();

    if (ordersSnapshot.empty) {
      return res.status(404).json({ message: 'No se encontraron órdenes anteriores' });
    }

    const history = ordersSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return res.status(200).json(history);
  } catch (error) {
    console.error('Error al obtener historial de pedidos:', error);
    return res.status(500).json({ message: 'Error del servidor al obtener historial' });
  }
};





module.exports = {createOrder, getOrderStatus, getOrders, getOrderHistory, updateOrderStatus, getAllOrders};