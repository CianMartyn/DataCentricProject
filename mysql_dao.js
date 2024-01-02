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
function getStores () {
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
function storeEdit (storeID, location, mgrid) {
    var editQuery = {
        sql: 'update store set location=?, mgrid=? where sid=?',  // SQL query to update store
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
function getProducts(id) {
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
function deleteProduct(id) {
    return new Promise((resolve, reject) => {
        pool.query(`DELETE FROM product_store where pid="${id}"`)
        .then((data) => {
            resolve(data)
        }).catch(err => {
            reject(err)
        })
    })
}

// Export the functions for use in other parts of the application
module.exports = { getStores, storeEdit, getProducts, deleteProduct }; 
