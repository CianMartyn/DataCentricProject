const mongo = require('mongodb').MongoClient;

// Connect to MongoDB
mongo.connect('mongodb://127.0.0.1:27017')
    .then((client) => {
        // Once connected, set the database and collection
        db = client.db('proj2023MongoDB');
        coll = db.collection('managers');
    })
    .catch((error) => {
        // Log any connection errors
        console.log(error.message);
    });

// Function to get all managers from the MongoDB collection
var getManagers = function() {
    return new Promise((resolve, reject) => {
        var cursor = coll.find();  // Fetch all documents in the managers collection
        cursor.toArray()
            .then((documents) => {
                resolve(documents);  // Resolve the promise with the fetched documents
            })
            .catch((error) => {
                reject(error);  // Reject the promise in case of an error
            });
    });
};

// Function to insert a new manager into the collection
var insertManager = function(manager) {
    return new Promise((resolve, reject) => {
        coll.insertOne(manager)  // Insert the given manager document into the collection
            .then((documents) => {
                resolve(documents);  // Resolve the promise with the result of the insert operation
            })
            .catch((error) => {
                reject(error);  // Reject the promise on error
            });
    });
};

// Function to find a specific manager in the collection
var findManager = function(manager) {
    return new Promise((resolve, reject) => {
        coll.findOne({_id: manager})  // Find a manager document by the given ID
        .then((documents) => {
            resolve(documents);  // Resolve the promise with the found document
        })
        .catch((error) => {
            reject(error);  // Reject the promise on error
        });
    });
};

// Export the functions to make them available for import in other files
module.exports = { getManagers, insertManager, findManager };
