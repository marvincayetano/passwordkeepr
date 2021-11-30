// load .env data into process.env
require("dotenv").config();

// Web server config
const PORT = process.env.PORT || 8080;
const sassMiddleware = require("./lib/sass-middleware");
const express = require("express");
const app = express();
const morgan = require("morgan");
const router  = express.Router();
const cookieSession = require("cookie-session")

// PG database client/connection setup
const { Pool } = require("pg");
const dbParams = require("./lib/db.js");
const db = new Pool(dbParams);
const {addUser, getUserWithEmailPassword} = require("./db/utils/index.js")
db.connect();

// Load the logger first so all (static) HTTP requests are logged to STDOUT
// 'dev' = Concise output colored by response status for development use.
//         The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.
app.use(morgan("dev"));

app.use(cookieSession({
  name: 'session',
  secret: "mileycyrus",
  // Cookie Options
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}));

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

app.use(
  "/styles",
  sassMiddleware({
    source: __dirname + "/styles",
    destination: __dirname + "/public/styles",
    isSass: false, // false => scss, true => sass
  })
);

app.use(express.static("public"));

// Separated Routes for each Resource
// Note: Feel free to replace the example routes below with your own
const usersRoutes = require("./routes/users");
const authRoutes = require("./routes/auth");
// All the gets are here
const pagesRoutes = require('./routes/pages');
const accountRoutes = require('./routes/accounts')

// Mount all resource routes
// Note: Feel free to replace the example routes below with your own
app.use("/", authRoutes(router, db));
app.use("/", pagesRoutes(router, db));
app.use("/", accountRoutes(router, db));

// Note: mount other resources here, using the same pattern above

// Home page
// Warning: avoid creating more routes in this file!
// Separate them into separate routes files (see above).

app.get("/", (req, res) => {
  res.render("index");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});

app.get("/register", (req, res) => {
  const templateVars = {user: null}
  res.render("register", templateVars)
})
app.post("/register", (req, res) => {
 const user = addUser(req.body)
 const id = user.id;
 req.session.id = id;
  res.redirect("/")
})

app.get("/login", (req, res) => {
  const templateVars = {user: null}
  res.render("login", templateVars)
})

app.post("/login", (req, res) => {
const email = req.body.email;
const password = req.body.password;

const user = getUserWithEmailPassword(email, password)

if(!user) {
  res.send("user does not exist")
}
const id = user.id
req.session.id = id;

  res.redirect('/')

})

app.post("/logout", (req, res) => {

})
