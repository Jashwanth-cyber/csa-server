const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const ObjectId= Schema.ObjectId;

const User= new Schema({
  
    email: {type: String, unique: true},
    password: String,
    firstname: String,
    lastname:String
});

const Admin= new Schema({
  
    email: {type: String, unique: true},
    password: String,
    firstname: String,
    lastname:String
});

const Course = new Schema({
    
    title:String,
    description: String,
    price:String,
    imageUrl:String,
    creatorId:ObjectId
})

const Purchases = new Schema({
    courseId:ObjectId,
    userId:ObjectId
})

const UserModel= mongoose.model('users',User)
const AdminModel= mongoose.model('admin',Admin)
const CourseModel= mongoose.model('courses',Course)
const PurchasesModel= mongoose.model('purchases',Purchases)

module.exports= {
    UserModel:UserModel,
    AdminModel:AdminModel,
    CourseModel:CourseModel,
    PurchasesModel:PurchasesModel
}