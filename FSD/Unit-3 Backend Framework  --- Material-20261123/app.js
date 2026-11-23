// JavaScript source code
const express = require('express');
const morgan = require('morgan');

const app = express()
const port = 3000
app.use(morgan('dev'));
app.use(morgan('combined'));
app.listen(port, (err) => {
    if(err) console.log("Error " + err)
    else console.log(`Example app listening on port ${port}`)
})

//localhost:3000/fsd

app.get('/fsd', (r, s) => {
    s.send('FSD Course')
})


app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.get('/about', (req, res) => {
    res.send('About Page! ' + req.query.q)
})
app.get("/student", (req, res) => {
    res.send("Student ID not provided");

});
// localhost:3000/studentid=fdsfds
app.get("/student/:id", (req, res) => {
    const id = req.params.id;
    res.json({
        id: id,
        name: 'Sam',
        age: 44
    });
    //res.send("Student ID: " + id);
   
});


