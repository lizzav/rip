const sequelize= require('../db')
const {DataTypes}= require('sequelize')

const Task=sequelize.define('user',{
  id:{type:DataTypes.INTEGER,primaryKey:true,autoIncrement:true},
  name:{type: DataTypes.STRING, allowNull:false},
  description:{type: DataTypes.STRING},
  isDone:{type: DataTypes.BOOLEAN},

})

module.exports={
  Task
}