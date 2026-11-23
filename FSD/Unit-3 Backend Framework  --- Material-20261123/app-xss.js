
const express = require("express");
const escapeHtml = require("escape-html");
const app = express();
//url 
app.get("/message", (req, res) => {
    const name = req.query.name;
    //const name = escapeHtml(req.query.name || "");
    res.send(`
        <h2>Hello ${name}</h2>
    `);
});



app.listen(3002, () => {
    console.log("Server running at http://localhost:3002");
});