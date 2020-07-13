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
      User.destroy({
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
    res.redirect("/admin/users");
  }
});

router.post("/users/save", (req, res) =>{
  let email = req.body.email;
  let password = req.body.password;
  let id = req.body.id;
  
  let salt = bcrypt.genSaltSync(10);
  let hash = bcrypt.hashSync(password, salt);

  User.update({
    email: email,
    password: hash
  }, {
    where: {
      id: id
    }      
  }).then(() => {
    res.redirect("/admin/users");
  }).catch(err => console.log(err));
});

router.get("/admin/users/edit/:id", (req, res) =>{
  let id = req.params.id;

  User.findByPk(id).then(user =>{
    if(user !== undefined){
        res.render("admin/User/edit", {user});
    }else{
      res.redirect("/");
    }
  }).catch(err =>{
    res.redirect("/");
  });

});

router.get("/login", (req, res) => {
  res.render("admin/User/login");
});

router.post("/authenticate", (req, res) => {
  let email = req.body.email;
  let password = req.body.password;

  User.findOne({where:{email: email}}).then(user => {
    if(user != undefined){ // Se existe um usuário com este email
      // validar senha
      let correct = bcrypt.compareSync(password,user.password);
      
      if(correct){
        req.session.user = {
          id: user.id,
          email: user.email
        }
        res.redirect("admin/articles");
      }else{
        res.redirect("/login");
      }
    }else {
      res.redirect("/login");
    }
  });
});

router.get("/admin/login", (req, res) => {
  let session = req.session.user = undefined;
  res.render("../views/partials/navbar.ejs",{session: req.session.user})
});

router.get("/logout", (req, res) => {
  req.session.user = undefined;
  res.redirect("/");
});


module.exports = router;