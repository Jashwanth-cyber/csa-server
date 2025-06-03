const express = require("express");

const mongoose = require("mongoose")

const { Router } = express;

const { z } = require("zod")

const bcrypt = require("bcrypt")

const jwt = require('jsonwebtoken')

const {JWT_USER_SECRET}= require("../config")

const {authUSER}= require("../middleware/userMw");

const { UserModel, PurchasesModel} = require("../db")

const userRouter = Router();


userRouter.post("/signup", async function (req, res) {


    const requiredBody = z.object({
        email: z.string().min(3).max(100).email(),
        password: z.string().min(3).max(30),
        firstname: z.string().min(3).max(100),
        lastname: z.string().min(3).max(100)

    })

    const parsedDataWithSuccess = requiredBody.safeParse(req.body)

    if (!parsedDataWithSuccess.success) {
        res.json({
            message: "Don't play abide with validation rules",
            error: parsedDataWithSuccess.error
        })
        return
    }


    const { email, password, firstname, lastname } = req.body;
    const hasedPassword = await bcrypt.hash(password, 5);

    try {
        await UserModel.create({
            email: email,
            password: hasedPassword,
            firstname,
            lastname
        });
        res.json({
            message: "You are signed up"
        })
    } catch (e) {
        res.json({
            message: "User already exists"
        })
    }

});

userRouter.post("/signin", async function (req, res) {
    const email = req.body.email;
    const password= req.body.password;

    const user = await UserModel.findOne({
        email: email,

    });

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (user && passwordMatch) {
        const token = jwt.sign({
            id: user._id.toString()
        }, JWT_USER_SECRET)

        res.json({
            message: "User logged in successfully",
            token
        })

    } else {
        res.status(403).json({
            message: "Incorrect creds"
        })
    }
});


userRouter.get("/purchases",authUSER, async function (req, res) {
    const userId = req.userId;

    const purchases = await PurchasesModel.find({
            userId
    })
    res.json({
        purchases,
    })
});

userRouter.get("/me", authUSER, async (req, res) => {
  const user = await UserModel.findById(req.userId);
  res.json({ user });
});

module.exports = {
    userRouter: userRouter
};