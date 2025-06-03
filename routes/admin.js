const express=  require("express");

const jwt = require("jsonwebtoken");

const {z} = require("zod")

const bcrypt = require("bcrypt") 

const { AdminModel, CourseModel} = require("../db.js")

const { Router }= express;

const adminRouter= Router();

const {authADMIN}= require("../middleware/adminMw.js")

const {JWT_ADMIN_SECRET}= require("../config.js");



adminRouter.post("/signup",async function(req,res){

        const requiredBody = z.object({
            email: z.string().min(3).max(100),
            firstname: z.string().min(3).max(100),
            lastname: z.string().min(3).max(100),
            password: z.string().min(3).max(30)
        })

        const parsedDataWithSuccess = requiredBody.safeParse(req.body)

        if(!parsedDataWithSuccess.success){
            res.json({
                message:"Don't play abide with validation rules",
                error:parsedDataWithSuccess.error
            })
            return
        }

       
        const {email, password, firstname, lastname} = req.body;
        const hashedPassword = await bcrypt.hash(password, 5);
        
        try {
        await AdminModel.create({
            email,
            password: hashedPassword,
            firstname,
            lastname
        });
        res.json({
            message: "You are signed up"
        })
    } catch(e) {
        res.json({
            message: "Admin already exists"
        })
    }
});



adminRouter.post("/signin",async function(req,res){
    const email = req.body.email;
    const password = req.body.password;

    const admin = await AdminModel.findOne({
        email: email,
        
    });
    
    const passwordMatch= await bcrypt.compare(password,admin.password);

    if (admin && passwordMatch) {
        const token = jwt.sign({    
            id: admin._id.toString()
        },JWT_ADMIN_SECRET)
       
        res.json({
            message: "Admin logged in successfully",
            token
        })
        
    } else {
        res.status(403).json({
            message: "Incorrect creds"
        })
    }
   
});



adminRouter.post("/course", authADMIN, async function(req,res){
    const adminId = req.adminId;
    const {title, description, price, imageUrl} = req.body;
    const course = await CourseModel.create({
        title,
        description,
        price,
        imageUrl,
        creatorId: adminId
    })
    res.json({
        message: "Course created successfully",
        courseId: course._id
    })
});

adminRouter.put("/course/:id",authADMIN,async function(req,res){
    const adminId = req.adminId;
   
    const {title, description, price, imageUrl,courseId} = req.body;   
    const updatecourse = await CourseModel.updateOne({
        _id:courseId,
        creatorId: adminId
    },{
        title,
        description,
        price,
        imageUrl
    }, {new: true})

    console.log(updatecourse)

    res.json({
        message: "Course updated successfully",
        courseId: updatecourse._id
    })

});

adminRouter.get("/course/bulk",authADMIN,async function(req,res){
    const adminId = req.adminId;

    const courses = await CourseModel.find({
        creatorId:adminId
    });

    res.json({
        message:"All courses",
        courses
    })
})
adminRouter.get("/me", authADMIN, async (req, res) => {
  const admin = await AdminModel.findById(req.adminId);
  res.json({ admin });
});



module.exports= {adminRouter: adminRouter}