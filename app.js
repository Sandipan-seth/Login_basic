const express = require("express");
const path = require("path");
const app = express();
const cookieParser = require("cookie-parser");
const userModel = require("./models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");


app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("login");
});

app.get("/signin", (req, res) => {
  res.render("index");
});

app.post("/create", async (req, res) => {
  try {
    const { username, email, password, age } = req.body;
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    const newUser = await userModel.create({
      username,
      email,
      password: hash,
      age,
    });
    const token = jwt.sign({ email }, "shhhhhh");
    res.cookie("token", token);
    // console.log(req.cookies);
    res.redirect("/");
  } catch (err) {
    console.error("Error creating user:", err);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/logout", (req, res) => {
  res.cookie("token", "");
  console.log(req.cookies);
  res.redirect("/");
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
