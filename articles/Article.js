const Sequelize = require("sequelize");
const connection = require("../database/database");

const article = connection.define('aeticles',{
  title:{
    type: Sequelize.STRING,
    allowNull: false
  },slug:{
    type: Sequelize.STRING,
    allowNull: false
  },
  body:{
    type: Sequelize.TEXT,
    allownull: false
  }
});

module.exports = article;