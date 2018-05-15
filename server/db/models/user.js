const crypto = require("crypto");
const Sequelize = require("sequelize");
const db = require("../db");

const User = db.define("user", {
  username: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: false
  },
  token: {
    type: Sequelize.STRING
  },
  githubId: {
    type: Sequelize.STRING
  }
});

module.exports = User;
