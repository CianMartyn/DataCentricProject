const pmysql = require('promise-mysql')
var pool;


pmysql.createPool({
    connectionLimit: 3,
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'proj2023'
})
    .then(p => {
        pool = p
    })
    .catch(e => {
        console.log("Pool Error: " + e) 
    });


var getStores = function () {
    return new Promise((resolve, reject) => {
        pool.query('select * from store')
            .then((data) => {
                console.log(data)
                resolve(data)
            })
            .catch(error => {
                reject(error)
            })
    })
}


var storeEdit = function (storeID, location, mgrid) {
    var editQuery = {
        sql: 'update store set location=?, mgrid=?, where sid=?',
        values: [location, mgrid, storeID]
    }
    return new Promise((resolve, reject) => {
        pool.query(editQuery)
            .then((data) => {
                resolve(data)
            })
            .catch((error) => {
                reject(error)
            })
    })
}

var getProducts = function () {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM product INNER JOIN product_store ON product.pid = product_store.pid')
            .then((data) => {
                console.log(data)
                resolve(data)
            })
            .catch(error => {
                reject(error)
            })
    })
}

var deleteProduct = function (productID) {
    var deletionQuery = {
        sql: 'delete from product where pid=?',
        values: [productID]
    }
    if(checkProduct(productID))
        return new Promise((resolve, reject) => {
            pool.query(deletionQuery)
                .then((data) => {
                    resolve(data)
                })
                .catch(error => {
                    reject(error)
                })
        })
    else
        return new Promise((resolve, reject) => {
            reject("Not found!")
        })
}

module.exports = { getStores, storeEdit, getProducts, deleteProduct };                                                    