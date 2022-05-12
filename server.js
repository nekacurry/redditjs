var express = require('express');
var exphbs  = require('express-handlebars');
var app = express();
// Set db
require('./data/reddit-db');
require('./controllers/posts')(app);

app.engine('handlebars', exphbs.engine({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/', function (req, res) {
    res.render('posts-index');
});

app.get("/posts/new", (req, res) => {
  res.render("posts-new");
});



app.listen(3000);

