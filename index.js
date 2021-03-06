const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const session = require("express-session");
const connection = require("./database/database");

//Categories
const categoriesController = require("./categories/categoriesController");
const articlesController = require("./articles/ArticlesController");
const usersController = require("./users/UsersController");

const Article = require("./articles/Article");
const Category = require("./categories/Category");
const User = require("./users/User");

//VIEW ENGINE
app.set('view engine', 'ejs');

// Sessions
app.use(session({
  secret: "asdsdaqewfsdfsd", cookie: {maxAge: 30000}
}));

//STATIC DEPRECATED
app.use(express.static('public'));

//BODY-PARSER
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// DATA-BASE
connection
  .authenticate()
  .then(() => {
    console.log("Conexão feita com sucesso");
  }).catch((erro) => {
    console.log(erro);
  });

app.use("/",categoriesController);
app.use("/",articlesController);
app.use("/",usersController);

app.get("/", (req, res) => {
  Article.findAll({
    order: [
      ['id', 'DESC']
    ],
    limit: 4
  }).then(articles => {
    Category.findAll().then(categories => {
      res.render("index", {articles: articles, categories: categories});
    });
  });
});

app.get("/:slug", (req, res) => {
  let slug = req.params.slug;

  Article.findOne({
    where: {
      slug: slug
    }
  }).then(article => {
    if(article != undefined){
      Category.findAll().then(categories => {
        res.render("article", {article: article, categories: categories});
      });
    }else{
      res.redirect("/");
    }
  }).catch(err => {
    res.redirect("/")
  });
});

app.get("/category/:slug", (req, res) => {
  let slug = req.params.slug;

  Category.findOne({
    where: {
      slug: slug
    },
    include: [{model: Article}]
  }).then(category => {
    if(category != undefined){
      Category.findAll().then(categories => {
        res.render("index", {articles: category.articles, categories: categories});
      });
    }else{
      res.redirect("/");
    }
  }).catch(err => {
    res.redirect("/");
  });
});

app.listen(8181,() => {
  console.log("App rodando!");
});