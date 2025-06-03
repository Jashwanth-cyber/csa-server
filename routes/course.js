const express= require("express");

const mongoose = require("mongoose") 

const { Router }= express;

const jwt = require('jsonwebtoken')

const {JWT_USER_SECRET}= require("../config")


const {authUSER} = require("../middleware/userMw");

const {CourseModel,PurchasesModel} = require("../db");

const coursesRouter= Router();

    coursesRouter.post("/purchase", authUSER, async function(req,res){
        try {
        const userId = req.userId;
        const courseId = req.body.courseId;

        if (!userId || !courseId) {
            return res.status(400).json({ message: "User or Course ID missing" });
        }
        const alreadyPurchased = await PurchasesModel.findOne({ userId, courseId });
        if (alreadyPurchased) {
            return res.status(400).json({ message: "User already purchased the course" });
        }
        await PurchasesModel.create({
            userId,
            courseId
        });

        res.json({
            message: "You have successfully bought the course"
        });
    } catch (err) {
        console.error("Purchase error:", err);
        res.status(500).json({ message: "Purchase failed. Please try again." });
    }
    })

    
    coursesRouter.get("/preview", async function(req,res){
        const courses = await CourseModel.find({});

        res.json({
            courses
        })
    
    });

module.exports={
    coursesRouter:coursesRouter
}