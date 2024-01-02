const pmysql = require('promise-mysql');
var pool;

// Create a connection pool for MySQL database
pmysql.createPool({
    connectionLimit: 3,
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'proj2023'
})
.then(p => {
    pool = p;  // Store the pool in a global variable for later use
})
.catch(e => {
    console.log("Pool Error: " + e);  // Log errors related to pool creation
});

// Function to get all stores from the database
var getStores = function () {
    return new Promise((resolve, reject) => {
        pool.query('select * from store')  // Execute a query to select all stores
            .then((data) => {
                console.log(data);  // Log the fetched data (optional)
                resolve(data);  // Resolve the promise with the data
            })
            .catch(error => {
                reject(error);  // Reject the promise if there's an error
            });
    });
};

// Function to edit a store's details
var storeEdit = function (storeID, location, mgrid) {
    var editQuery = {
        sql: 'update store set location=?, mgrid=?, where sid=?',  // SQL query to update store
        values: [location, mgrid, storeID]  // Values to replace in query placeholders
    };
    return new Promise((resolve, reject) => {
        pool.query(editQuery)
            .then((data) => {
                resolve(data);  // Resolve with the result of the update operation
            })
            .catch((error) => {
                reject(error);  // Reject the promise on error
            });
    });
};

// Function to get all products
var getProducts = function () {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM product INNER JOIN product_store ON product.pid = product_store.pid')  // Query to join and fetch product data
            .then((data) => {
                console.log(data);
                resolve(data);
            })
            .catch(error => {
                reject(error);
            });
    });
};

// Function to delete a product
var deleteProduct = function (productID) {
    var deletionQuery = {
        sql: 'delete from product where pid=?',
        values: [productID]
    };
    if(checkProduct(productID))  // Check if the product can be deleted
        return new Promise((resolve, reject) => {
            pool.query(deletionQuery)
                .then((data) => {
                    resolve(data);  // Resolve if deletion is successful
                })
                .catch(error => {
                    reject(error);  // Reject on error
                });
        })
    else
        return new Promise((resolve, reject) => {
            reject("Not found!");  // Reject if product check fails
        });
};

// Export the functions for use in other parts of the application
module.exports = { getStores, storeEdit, getProducts, deleteProduct }; 
