const mongoose=require('mongoose')
const Schema = mongoose.Schema

const userSchema=new Schema({
    firstName:{
        type:String,
        required:true
    },
    lastName:{
        type:String,
        required:true
    },
    contact:{
        type:Number,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    token:{
        type:String
    },
    imgPath:{
        type:String
    }
})

module.exports.User= new mongoose.model('User', userSchema)
