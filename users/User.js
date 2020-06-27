const Sequelize = require("sequelize");
const connection = require("../database/database");

const User = connection.define('users',{
  Email:{
    type: Sequelize.STRING,
    allowNull: false
  },Pssword: {
    type: Sequelize.STRING,
    allowNull: false
  }
})

// User.sync({force: false});

/*
  Sincroniza o banco de dados pela primeira vez, criando a tabela
  Category.sync({force: true});
*/

module.exports = User;