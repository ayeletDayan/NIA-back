const orderService = require('./order.service.js');
const logger = require('../../services/logger.service')
const socketService = require('../../services/socket.service')

// GET LIST
async function getOrders(req, res) {
  // console.log(req);
  try {
    var queryParams = req.query;
    const orders = await orderService.query(queryParams)
    res.json(orders);
  } catch (err) {
    logger.error('Failed to get orders', err)
    res.status(500).send({ err: 'Failed to get orders' })
  }
}

// GET BY ID 
async function getOrderById(req, res) {
  try {
    const orderId = req.params.id;
    const order = await orderService.getById(orderId)
    res.json(order)
  } catch (err) {
    logger.error('Failed to get order', err)
    res.status(500).send({ err: 'Failed to get order' })
  }
}

// POST (add order)
async function addOrder(req, res) {
  try {
    const order = req.body;
    const addedOrder = await orderService.add(order)
    res.json(addedOrder)

    // socketService.broadcast({type: 'order-added', data: order, userId: order.byUser._id})
    socketService.emitToUser({type: 'order-to-you', data: order, userId: order.host._id})
    // socketService.emitTo({type: 'user-updated', data: fullUser, label: fullUser._id})

  } catch (err) {
    logger.error('Failed to add order', err)
    res.status(500).send({ err: 'Failed to add order' })
  }
}

// PUT (Update order)
async function updateOrder(req, res) {
  try {
    const order = req.body;
    console.log(order);
    const updatedOrder = await orderService.update(order)
    res.json(updatedOrder)
  } catch (err) {
    logger.error('Failed to update order', err)
    res.status(500).send({ err: 'Failed to update order' })

  }
}

// DELETE (Remove order)
async function removeOrder(req, res) {
  try {
    const orderId = req.params.id;
    const removedId = await orderService.remove(orderId)
    res.send(removedId)
  } catch (err) {
    logger.error('Failed to remove order', err)
    res.status(500).send({ err: 'Failed to remove order' })
  }
}

module.exports = {
  getOrders,
  getOrderById,
  addOrder,
  updateOrder,
  removeOrder
}
