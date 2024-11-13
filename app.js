const express = require("express");
const app = express();
const port = 3000;
const userController = require("./controllers/UserController");
const authController = require("./controllers/AuthController");

app.use(express.json());
app.get("/", (req, res) => {
    res.send("Forum Tani ID API is Up");
});

app.use("/api/users", userController);

app.use("/api/auth", authController);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
