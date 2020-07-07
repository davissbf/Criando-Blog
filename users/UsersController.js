const express = require("express");
const router = express.Router();
const User = require('./User');
const bcrypt = require('bcryptjs');


router.get("/admin/users", (req, res) => {
  User.findAll().then(users => {
    res.render("../views/admin/User/index.ejs", {users: users});
  });
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

router.post("/users/delete", (req, res) =>{
  let id = req.body.id;

  if(id !== undefined){
    if(!isNaN(id)){
      email.destroy({
        where: {
          id: id
        }
      }).then(()=>{
        res.redirect("/admin/users")
      });

    }else{ // se o id não for um numero
      res.redirect("/admin/users");
    }
  }else{ // NULL
    res.regirect("/admin/users");
  }
});

router.get("/admin/users/edit/:id", (req, res) =>{
  let id = req.params.id;
  console.log(id);

  User.findByPk(id).then(email =>{
    if(email !== undefined){
      User.findAll().then(email =>{
        res.render("admin/user/edit", {email: email});
      });
    }else{
      res.redirect("/");
    }
  }).catch(err =>{
    res.redirect("/");
  });

});


module.exports = router;