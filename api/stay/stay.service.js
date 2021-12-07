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
        const criteria = _buildCriteria(filterBy)
        // const criteria = {}
        const collection = await dbService.getCollection('stay')
        var stays = await collection.find(criteria).toArray()
        return stays
    } catch (err) {
        logger.error('cannot find stays', err)
        throw err
    }
}

async function getById(stayId) {
    try {
        const collection = await dbService.getCollection('stay')
        const stay = collection.findOne({ '_id': ObjectId(stayId) })
        return stay
    } catch (err) {
        logger.error(`while finding stay ${stayId}`, err)
        throw err
    }
}

async function remove(stayId) {
    try {
        const collection = await dbService.getCollection('stay')
        await collection.deleteOne({ '_id': ObjectId(stayId) })
        return stayId
    } catch (err) {
        logger.error(`cannot remove stay ${stayId}`, err)
        throw err
    }
}

async function add(stay) {
    try {
        const collection = await dbService.getCollection('stay')
        const addedStay = await collection.insertOne(stay)
        return addedStay
    } catch (err) {
        logger.error('cannot insert stay', err)
        throw err
    }
}

async function update(stay) {
    try {
        var id = ObjectId(stay._id)
        delete stay._id
        const collection = await dbService.getCollection('stay')
        await collection.updateOne({ "_id": id }, { $set: { ...stay } })
        return stay
    } catch (err) {
        logger.error(`cannot update stay ${stayId}`, err)
        throw err
    }
}

function _buildCriteria(filterBy) {
    console.log('for criteria', filterBy)
    const criteria = {}
    if (filterBy.city) {
        const txtCriteria = { $regex: filterBy.city, $options: 'i' }
        criteria.city = txtCriteria
    }
    if (filterBy.type) {
        const txtCriteria = { $regex: filterBy.type, $options: 'i' }
        criteria.type = txtCriteria
    }
    if (filterBy.price) { 
        filterBy.price = JSON.parse(filterBy.price)       
        criteria.$and = [
          { price: { $gte: +(filterBy.price.minPrice)}},
          {price:  { $lte: +(filterBy.price.maxPrice)}}
         ]}
        

    console.log('criteria:', criteria);
    return criteria
}


// function _filterStays(filterBy){
//     var stays = JSON.parse(JSON.stringify(gStays));

//     if (filterBy.select) {
//         const { select } = filterBy
//         if (select === 'In stock') stays = stays.filter(stay => stay.inStock)
//         else if (select === 'Out of stock') stays = stays.filter(stay => !stay.inStock)
//     }

//     // filter by name
//     if (filterBy.txt) {
//         const regex = new RegExp(filterBy.txt, 'i');
//         stays = stays.filter((stay) => regex.test(stay.name));
//     }

//     // filter by labels
//     if (filterBy.lable && filterBy.lable.length) {
//         stays = stays.filter(stay=>{
//             return (!stay.labels.length ||
//             filterBy.lable.some(lb=> !lb.length || stay.labels.includes(lb)))
//         })
//     }
//     return stays
// }