const Sequelize = require("sequelize")
const sequelize = require("../../util/database")
const User = sequelize.define("user", {
     id:{
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true
    },
     fullname: {
      type: Sequelize.STRING(99),
      required: true
    },
     email: {
      type: Sequelize.STRING(64),
      validate: {
        is: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      },
      required: true,
    }, 
     username: {
      type: Sequelize.STRING(50),
      required: true
    },   
     password: {
      type: Sequelize.STRING(200),
      required: true
    },
    phone: {
     type: Sequelize.STRING(12),
     validate: {
       is: /\d{3}-\d{3}-\d{4}/
     }
    //  required: true,
   },
    dob: {
     type: 'TIMESTAMP',
     required: false
       // defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
       // allowNull: false
   } ,
    pob: {
     type: Sequelize.STRING(50),
     required: false
   }, 
    cob: {
     type: Sequelize.STRING(50),
     required: false
   }
 })
 module.exports = User