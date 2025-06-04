const express = require('express');
const mongoose = require("mongoose");
const dotenv = require("dotenv");


dotenv.config();


const app = express();

const cors = require("cors");

app.use(cors({
    origin: ["http://localhost:5173","https://csa-client-tau.vercel.app"],
    credentials: true,
}));

app.set("trust proxy", true);

app.use(express.json());


const { userRouter } = require("./routes/user.js");
const { coursesRouter } = require("./routes/course.js");
const { adminRouter } = require("./routes/admin.js");

app.use("/user", userRouter);
app.use("/courses", coursesRouter);
app.use("/admin", adminRouter);




async function main() {
    await mongoose.connect(process.env.MONGO_URL);

    const port = process.env.PORT;
    app.listen(port , () => {
        console.log('Server is running on port 3004');
    });
}

main();