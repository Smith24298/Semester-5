
// Importing required modules
const express = require('express');
const app = express();

//const bodyParser = require('body-parser');
//app.use(bodyParser.json());
app.use(express.json());
// Creating an Express application instance
app.use(express.static("public"));
// Middleware for parsing application/json

app.use(express.urlencoded({ extended: true }));

app.post("/student", (req, res) => {
    console.log(req.body);
    res.json({
        id: 123,
        name: req.body.name,
        age: req.body.age
    });
    //res.send(`Name: ${req.body.name}, Age: ${req.body.age}`);
});

// Define a route for the homepage
app.get('/test', (req, res) => {
    res.send('Hello from Express!');
});

// Define a route for handling POST requests
app.post('/api/data', (req, res) => {
    const data = req.body;
    console.log('Received data:', data);
    res.send('Data received successfully!'+ data.name );
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
