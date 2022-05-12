// Require Libraries
require("dotenv").config();
const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const checkAuth = require("./middleware/checkAuth");
const port = 3000;

// App Setup
const exphbs = require("express-handlebars");
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

app.use(express.static(__dirname + "/public"));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(checkAuth);


require("./data/reddit-db");
require("./controllers/posts")(app);
require("./controllers/comments.js")(app);
require("./controllers/auth.js")(app);
require("./controllers/replies")(app);

// Routes
app.get("/", (req, res) => {
  res.render("posts-index");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

app.get("/posts/new", (req, res) => {
  res.render("posts-new");
});

module.exports = app;

