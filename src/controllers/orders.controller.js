const { db } = require('../config/firebase');

const createOrder = async (req, res) => {
  const { products} = req.body;
  const email = req.user.email;
  const name = req.user.name;

  if (!products || !Array.isArray(products)) {
    return res.status(400).json({ message: 'Datos incompletos' });
  }

  try {
    // Buscar al cliente por su email
    const userSnapshot = await db.collection('users').where('email', '==', email).get();
    if (userSnapshot.empty) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const userDoc = userSnapshot.docs[0];
    const userData = userDoc.data();


    let total = 0;
    const batch = db.batch(); // Usamos batch para hacer updates seguros
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
      const productRef = db.collection('products').doc(doc.id);
      batch.update(productRef, { stock: data.stock - quantity });

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

    // Crear orden
    const newOrder = {
      email,
      products: detailedProducts,
      status: 'pendiente',
      total,
      createdAt: new Date(),
      name
    };

    const orderRef = db.collection('orders').doc();
    batch.set(orderRef, newOrder);

    // Ejecutar batch
    await batch.commit();

    res.status(201).json({ message: 'Orden creada con éxito', orderId: orderRef.id });
  } catch (error) {
    console.error('Error al crear orden:', error);
    res.status(500).json({ message: 'Error al procesar la orden' });
  }
};


module.exports = {createOrder};