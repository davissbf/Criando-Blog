const express = require("express");
const router = express.Router();
const User = require('./User');
const bcrypt = require('bcryptjs');


router.get("/admin/users", (req, res) => {
  res.send("Listagem de usuários!!!!");
});

router.get("/admin/users/create", (req, res) => {
  res.render("../views/admin/User/create.ejs");
});

router.post("/users/create", (req, res) =>{
  let email = req.body.email;
  let password = req.body.password;


  User.findOne({where:{email: email}}).then( user => {
    if(user == undefined){
      

      let salt = bcrypt.genSaltSync(10);
      let hash = bcrypt.hashSync(password, salt);

      User.create({
        email: email,
        password: hash
      }).then(() =>{
        res.redirect("/");
      }).catch((err) =>{
        res.redirect("/");
      })

      //res.json({email, password});


    }else{
      res.send(`
          <div style="max-width: 70%; margin: 10rem auto">
            <div style="margin-bottom: 2rem; font-family: sans-serif">
              O Email <span style="color: #d7385e; font-weight: bold">${user.email}</span> já existe, faça login para continuar
              <a href="/login" style="background-color: #363062; padding: 1rem; color: #fff; border-radius: .2rem">Fazer login</a>
            </div>
            <br>
            <div style="font-family: sans-serif">
              Ou crie sua conta com um email diferente.
              <a href="/admin/users/create" style="background-color: #d7385e; padding: 1rem; color: #fff; border-radius: .2rem">Criar nova conta</a>
            </div>
          </div>
      `)
    }
  });
});


module.exports = router;