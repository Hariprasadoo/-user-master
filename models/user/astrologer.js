const Sequelize = require("sequelize")
const sequelize = require("../../util/database")
const User = require("./user");


const Astrologer = sequelize.define("astrologers", {
    id:{
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true
    },
     abbreviation: {
      type: Sequelize.STRING(99),
      required: true
    },
      university: {
      type: Sequelize.STRING(64),
      required: true
    }, 
     los: {//level of study
      type: Sequelize.STRING(50),
      required: true
    },   
    sector: {
      type: Sequelize.STRING(200),
      required: true
    }
 });
//  User.hasOne(Astrologer);
//Define more relationship between User and Astrologer table as below 
// Astrologer.belongsTo(User, { 
//    ForeinKey: {
//     name: 'userId', //Name of forein colunm
//     type: DataType.INTEGER, //type of forein column data
//     allowNull: false, //forein column should not be null
//     onDelete: CASCADE //if CASCADE, when delete parent data child data will be deeted 
//    }
//   })
 Astrologer.belongsTo(User);
 module.exports = Astrologer