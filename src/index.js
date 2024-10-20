// importing necessary modules
const express = require("express");
const path = require("path");
const bcrypt = require("bcrypt");
const collection = require("./config");

//create express application
const app = express();

//convert data into json format
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//use EJS as the view engine
app.set("view engine", "ejs");

//static file
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("login");
});

app.get("/signup", (req, res) => {
  res.render("signup");
});

//Register User
app.post("/signup", async (req, res) => {
  const data = {
    name: req.body.username,
    password: req.body.password,
  };
  //checking if user already exist-to avoid duplication
  const exists = await collection.findOne({ name: data.name });
  if (exists) {
    res.send("user already exists. Please choose a different username");
  } else {
    //hash the password using bcrypt
    const saltRounds = 10;
    const hashedPass = await bcrypt.hash(data.password, saltRounds);
    //replace hash pass with original
    data.password = hashedPass;
    const userdata = await collection.insertMany(data);
    console.log(userdata);
  }
});

//Login user
app.post("/login", async (req, res) => {
  try {
    const check = await collection.findOne({ name: req.body.username });
    if (!check) {
      res.send("user not found");
    }
    //compare the hash password from db with plain text
    const isPassMatch = await bcrypt.compare(req.body.password, check.password);
    if (isPassMatch) {
      res.render("home");
    } else {
      res.send("wrong password");
    }
  } catch {
    res.send("error");
  }
});
//port to run application
const port = 5000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
