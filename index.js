const express = require('express');
const mysql_dao = require('./mysql_dao');
const mongodb_dao = require('./mongodb_dao');
const app = express();
const { check, validationResult } = require('express-validator');
const bodyParser = require('body-parser');

// Setting up EJS as the view engine
app.set('view engine', 'ejs');

// Body-parser middleware for parsing request bodies
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const port = 3004;

// Route for the Home Page
app.get('/', (req, res) => {
    // Render the home view
    res.render("home");
});

// Route for displaying stores
app.get('/stores', (req, res) => {
    // Retrieve stores from MySQL database
    mysql_dao.getStores()
        .then((data) => {
            // Render the stores view with data
            res.render("stores", { "stores": data });
        })
        .catch((error) => {
            console.log(error);
        });
});

// Route for displaying store edit form
app.get('/stores/edit/:sid', (req, res) => {
    // Render the store edit view
    res.render("storeEdit", { errors: undefined, sid: req.params.sid });
});

// Route to handle store edit form submission
app.post('/stores/edit/:sid',
    [
        // Validate the input fields
        check("sid").isLength({ min: 5, max: 5 }).withMessage("Store ID must be 5 characters long"),
        check("location").isLength({ min: 1 }).withMessage("Please enter a location."),
        check("mgrid").isLength({ min: 4, max: 4 }).withMessage("Manager ID must be 4 characters.")
    ],
    (req, res) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            // If errors, render the edit form again with errors
            res.render("storeEdit", { errors: errors.errors, sid: req.params.sid });
        } else {
            // Update the store in the database
            mysql_dao.storeEdit(req.params.sid, req.body.location, req.body.mgrid)
                .then((data) => {
                    // Handle the response based on the result
                    if (data.affectedRows == 1)
                        res.send("Store " + req.params.sid + " edited!");
                    else
                        res.send("Store " + req.params.sid + " not found!")
                })
                .catch((error) => {
                    console.log(error);
                    res.send("Error")
                });
        }
    });

// Route for displaying products
app.get('/products', (req, res) => {
    // Retrieve products from MySQL database
    mysql_dao.getProducts()
        .then((data) => {
            // Render the products view with data
            res.render("products", { "products": data });
        })
        .catch((error) => {
            console.log(error);
        });
});

// Route for deleting a product
app.get('/products/delete/:pid', async (req, res) => {
    // Delete the product and handle the response
    mysql_dao.deleteProduct(req.params.pid)
        .then(() => {
            res.redirect('/products');
        })
        .catch((error) => {
            res.send(error);
        });
});

// Route for displaying managers (MongoDB)
app.get('/managers', (req, res) => {
    // Retrieve managers from MongoDB
    mongodb_dao.getManagers()
        .then((data) => {
            // Render the managers view with data
            res.render("managers", { "managers": data });
        })
        .catch((error) => {
            console.log(error);
        });
});

// Route for displaying manager insertion form
app.get('/managers/add', (req, res) => {
    // Render the add manager view
    res.render("insertManager", { errors: undefined });
});

// Route to handle manager insertion form submission
app.post('/managers/add',
    [
        // Validate the input fields
        check("mgrid").isLength({ min: 4 }).withMessage("ID must be 4 characters."),
        check("name").isLength({ min: 5 }).withMessage("Name must be at least 5 characters."),
        check("salary").isFloat({ min: 30000, max: 70000 }).withMessage("Salary must be between 30,000 and 70,000.")
    ],
    (req, res) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            // If errors, render the form again with errors
            res.render("insertManager", { errors: errors.errors });
        } else {
            // Insert the new manager into MongoDB
            var newManager = { _id: req.body.mgrid, name: req.body.name, salary: req.body.salary };
            mongodb_dao.insertManager(newManager)
                .then(() => {
                    // Redirect to the managers page after successful insertion
                    res.redirect("/managers");
                })
                .catch((error) => {
                    console.log(error);
                    // Send an error message if there is an issue with insertion
                    res.send("Error: Unable to insert manager, criteria not met");
                });
        }
    });

// Start the Express server
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
