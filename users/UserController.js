const express = require("express");
const router = express.Router();
const User = require('./User');


router.get("/admin/users", (req, res) => {
  res.send("Listagem de Usuários!!!!")
});

router.get("/admin/users/create", (req, res) => {
  res.render("../views/admin/User/create.ejs")
});

module.exports = router;


