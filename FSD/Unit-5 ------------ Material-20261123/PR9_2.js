const express = require("express");
const basicAuth = require("express-basic-auth");

const app = express();

app.use(
  basicAuth({
    users: {
      jay: "1234",
      student: "1234"
    },
    challenge: true
  })
);

app.get("/", (req, res) => {
  res.json({
    message: "Authenticated successfully"
  });
});

app.listen(3001, () => {
  console.log("Server running on port 3001");
});
