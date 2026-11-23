//https://lms.nirmauni.ac.in/question/banks.php?courseid=10674

const http = require("http");

const users = [
  {
    username: "jay",
    password: "1234",
    role: "admin"
  },
  {
    username: "student",
    password: "1234",
    role: "user"
  }
];


// app.get("/",(req,res)=>{ })
const server = http.createServer((req, res) => {
  // Get username and password from headers
  const username = req.headers.username;
  const password = req.headers.password;

  // ---------- AUTHENTICATION ----------
  const user = users.find(
    u => u.username === username && u.password === password
  );

  if (!user) {
    res.writeHead(401, {
      "Content-Type": "application/json"
    });

    return res.end(
      JSON.stringify({
        message: "Authentication failed"
      })
    );
  }

  // ---------- AUTHORIZATION ----------
  if (req.url === "/admin") {

    if (user.role !== "admin") {
      res.writeHead(403, {
        "Content-Type": "application/json"
      });

      return res.end(
        JSON.stringify({
          message: "Access denied. Admin only."
        })
      );
    }

    res.writeHead(200, {
      "Content-Type": "application/json"
    });

    return res.end(
      JSON.stringify({
        message: "Welcome Admin!",
        user: user.username
      })
    );
  }

  // Normal user route
  res.writeHead(200, {
    "Content-Type": "application/json"
  });

  res.end(
    JSON.stringify({
      message: "Login successful",
      user: user.username,
      role: user.role
    })
  );
});

server.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
