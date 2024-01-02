const mongo = require('mongodb').MongoClient

mongo.connect('mongodb://127.0.0.1:27017')
    .then((client) => {
        db = client.db('proj2023MongoDB')
        coll = db.collection('managers')
    })
    .catch((error) => {
        console.log(error.message)
    })

var getManagers = function() {
    return new Promise((resolve, reject) => {
        var cursor = coll.find()
        cursor.toArray()
            .then((documents) => {
                resolve(documents)
            })
            .catch((error) => {
                reject(error)
            })
    })
}

var insertManager = function(manager) {
    return new Promise((resolve, reject) => {
        console.log(manager);
        coll.insertOne(manager)
            .then((documents) => {
                resolve(documents)
            })
            .catch((error) => {
                reject(error)
            })
    })
}

var findManager = function(manager) {
    return new Promise((resolve, reject) => {
        coll.findOne({_id: manager})
        .then((documents) => {
            resolve(documents)
        })
        .catch((error) => {
            reject(error)
        })
    })
}

module.exports = { getManagers, insertManager, findManager }



