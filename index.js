const express = require('express')
const mysql_dao = require('./mysql_dao')
const mongodb_dao = require('./mongodb_dao')
const app = express()
const { check, validationResult } = require('express-validator')
let ejs = require('ejs')
app.set('view engine', 'ejs')
const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const port = 3004

//Home Page
app.get('/', (req, res) => {
    res.render("home");
})

//Stores
app.get('/stores', (req, res) => {
    mysql_dao.getStores()
        .then((data) => {
            res.render("stores", { "stores": data });
        })
        .catch((error) => {
            console.log(error)
        });
})


app.get('/stores/edit/:sid', (req, res) => {
    res.render("storeEdit", { errors: undefined, sid: req.params.sid });
})
app.post('/stores/edit/:sid',
    [   
        check("sid").isLength({min: 5, max: 5}).withMessage("Store ID must be 5 characters long"),
        check("location").isLength({ min: 1 }).withMessage("Please enter a location."),
        check("mgrid").isLength({ min: 4, max: 4 }).withMessage("Manager ID must be 4 characters.")
  
    ], (req, res) => {
        const errors = validationResult(req);   

        if (!errors.isEmpty()) {
            res.render("storeEdit", { errors: errors.errors, sid: req.params.sid });
        }
        else {
            mysql_dao.storeEdit( req.params.storeID, req.params.location, req.params.mgrid)
                .then((data) => {
                    if (data.affectedRows == 1)
                        res.send("Store " + req.params.storeID + " edited succesfully!");
                    else (data.affectedRows == 0)
                    res.send("Store " + req.params.storeID + " not found!")
                })
                .catch((error) => {
                    console.log(error);
                    res.send("id ERROR")
                });
            res.send("Store updated")     
        }
    })

//Products
app.get('/products', (req, res) => {
    mysql_dao.getProducts()
        .then((data) => {
            res.render("products", { "products": data });
        })
        .catch((error) => {
            console.log(error)
        });
})

app.get('/products/delete/:pid', async (req, res) => {
    var found = 0;

    mysql_dao.deleteProduct(req.params.pid)
              .then(() => {
                res.redirect('/products');
              })
              .catch((error) => {
                res.send(error);
              });
          });

app.get('/managers', (req, res) => {
    mongodb_dao.getManagers()
        .then((data) => {       
            res.render("managers", { "managers": data });
        })
        .catch((error) => {
            console.log(error)
        });
})

app.get('/managers/add', (req, res) => {
    res.render("insertManager", { errors: undefined});
})

app.post('/managers/add',
    [
        check("mgrid").isLength({min:4}).withMessage("ID must be 4 characters."),
        check("name").isLength({min:5}).withMessage("Name must be at least 5 characters."),
        check("salary").isFloat({min:30000,max:70000}).withMessage("Salary must be between 30,000 and 70,000.")
    ], (req, res) => {
        const errors = validationResult(req);
        console.log(errors);
        console.log(req.body.mgrid+" "+req.body.name+" "+req.body.salary)

        if(!errors.isEmpty()) {
            res.render("insertManager",{errors:errors.errors});
        }
        else {
            var newManager = {_id: req.body.mgrid, name: req.body.name, salary: req.body.salary};
            mongodb_dao.addManager(newManager)
            .then((data) => {
                res.redirect("/managers");
            })
            .catch((error) => {
                console.log(error)
                res.send("Error: Manager ID already exists")
            });
        }
})

app.listen(port, async () => {
    console.log(`Example app listening on port ${port}`)
})