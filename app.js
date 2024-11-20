const express = require("express");
const bodyParser = require("body-parser");
const userController = require("./controllers/UserController");

const app = express();
const port = 3000;

// Middleware untuk parsing JSON
app.use(bodyParser.json());

// Endpoint utama untuk mengecek status API
app.get("/", (req, res) => {
  res.send("User API is Running");
});

// Routing untuk user
app.use("/api/users", userController);

// Jalankan server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
