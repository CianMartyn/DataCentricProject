const express = require('express');
const app = express();

// parse JSON and form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// route for home page
app.get('/', (req, res) => {
    res.send('Welcome to the Home Page!');
});

// example route
app.get('/about', (req, res) => {
    res.send('This is the About Page');
});
 
// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
