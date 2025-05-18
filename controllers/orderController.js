const { v4: uuidv4 } = require('uuid');
const Order = require('../models/orders');
const Item = require('../models/item');

exports.createOrder = async (req, res, next) => {
  try {
    const { items } = req.body;

    if (!items) {
      return res.status(400).json({ message: 'Missing items or userId' });
    }

    // Create order
    let totalAmount = 0;

    const order = await Order.create({ totalAmount, id: uuidv4() });

    const orderItems = items.map(item => {
      totalAmount += item.price * item.quantity;
      return {
        id: uuidv4(),
        orderId: order.dataValues.id,
        productId: item.id,
        quantity: item.quantity,
      };
    });

    await Item.bulkCreate(orderItems);

    res.status(201).json({ message: 'Order created successfully' });
  } catch (err) {
    next(err);
  }
};
