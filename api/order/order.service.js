const dbService = require('../../services/db.service')
const logger = require('../../services/logger.service')
const ObjectId = require('mongodb').ObjectId

module.exports = {
    remove,
    query,
    getById,
    add,
    update
}
async function query(filterBy) {
    console.log(filterBy);
    try {
        const collection = await dbService.getCollection('order')
        // if (filterBy.host) {
        //     const collection = await dbService.getCollection('stay')
        //     //1.find all the stays of the host:
        //     const stays = await collection.find({"host._id":"filterBy.host._id"}).toArray()
        //     //2.find the orders for the specific stay - getStayById ? > filter the orders array according to the specific stay. 
        if (filterBy.host) {
            const orders = await collection.find({"host._id":"filterBy.host._id"}).toArray()
        }
        if (filterBy.byUser) {
            const collection = await dbService.getCollection('order')
            const orders = await collection.find({"byUser._id":"filterBy.byUser._id"}).toArray()
         } return orders
    } catch (err) {
        logger.error('cannot find orders', err)
        throw err
    }
}

async function getById(orderId) {
    try {
        const collection = await dbService.getCollection('order')
        const order = collection.findOne({ '_id': ObjectId(orderId) })
        return order
    } catch (err) {
        logger.error(`while finding order ${orderId}`, err)
        throw err
    }
}

async function remove(orderId) {
    try {
        const collection = await dbService.getCollection('order')
        await collection.deleteOne({ '_id': ObjectId(orderId) })
        return orderId
    } catch (err) {
        logger.error(`cannot remove order ${orderId}`, err)
        throw err
    }
}

async function add(order) {
    try {
        const collection = await dbService.getCollection('order')
        const addedOrder = await collection.insertOne(order)
        return addedOrder.ops[0]
    } catch (err) {
        logger.error('cannot insert order', err)
        throw err
    }
}

async function update(order) {
    try {
        var id = ObjectId(order._id)
        delete order._id
        const collection = await dbService.getCollection('order')
        await collection.updateOne({ "_id": id }, { $set: { ...order } })
        return order
    } catch (err) {
        logger.error(`cannot update order ${orderId}`, err)
        throw err
    }
}

// function _buildCriteria(filterBy) {
//     console.log('for criteria', filterBy)
//     const criteria = {}
//     if (filterBy.host) {
//         const orders = await collection.findOne
//         // const txtCriteria = { $regex: filterBy.host, $options: 'i' }
//         // criteria.host = txtCriteria
//     }
//     if (filterBy.byUser) {
//         const txtCriteria = { $regex: filterBy.byUser, $options: 'i' }
//         criteria.byUser = txtCriteria
//     }
    
//     console.log('criteria:', criteria);
//     return criteria
// }


// function _filterOrders(filterBy){
//     var orders = JSON.parse(JSON.stringify(gOrders));

//     if (filterBy.select) {
//         const { select } = filterBy
//         if (select === 'In stock') orders = orders.filter(order => order.inStock)
//         else if (select === 'Out of stock') orders = orders.filter(order => !order.inStock)
//     }

//     // filter by name
//     if (filterBy.txt) {
//         const regex = new RegExp(filterBy.txt, 'i');
//         orders = orders.filter((order) => regex.test(order.name));
//     }

//     // filter by labels
//     if (filterBy.lable && filterBy.lable.length) {
//         orders = orders.filter(order=>{
//             return (!order.labels.length ||
//             filterBy.lable.some(lb=> !lb.length || order.labels.includes(lb)))
//         })
//     }
//     return orders
// }