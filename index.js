const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const connection = require("./database/database");

//Categories
const categoriesController = require("./categories/categoriesController");
const articlesController = require("./articles/ArticlesController");

const Article = require("./articles/Article");
const Category = require("./categories/Category");

//VIEW ENGINE
app.set('view engine', 'ejs');

//STATIC
app.use(express.static('public'));

//BODY-PARSER
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// DATA-BASE
connection
  .authenticate()
  .then(()=>{
    console.log("Conexão feita com sucesso");
  }).catch((erro)=>{
    console.log(erro);
  });

app.use("/", categoriesController);
app.use("/", articlesController);

app.get("/", (req, res)=>{
  res.render("index");
});

app.listen(8181,()=>{
  console.log("App rodando!");
});