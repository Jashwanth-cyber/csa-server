const jwt=require('jsonwebtoken');

const {JWT_ADMIN_SECRET}= require("../config")

function authADMIN(req, res, next) {
    const token = req.headers.token;

    const response = jwt.verify(token, JWT_ADMIN_SECRET);


    if (response.id) {
        req.adminId = response.id;
        next();
    }
    else {
        res.status(403).json({
            message: "Incorrect creds"
        })
    }
}
module.exports={
   authADMIN
}