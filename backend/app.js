const express = require("express");
const mongoose = require("mongoose");
const errorHandler = require("./middleware/error");
const morgan = require("morgan");
const cors = require("cors");
const bodyParser = require("body-parser");
const authRoute = require("./routes/authRoute");
const postRoute = require("./routes/postRoute");
const cookieParser = require("cookie-parser");
const multer = require("multer");
const app = express();
require("dotenv").config();
app.use(morgan("dev"));
// app.use(
//   cors({
//     credentials: true,
//     origin: ["http://localhost:3000"],
//     methods: ["GET", "PUT", "POST", "DELETE", "OPTIONS"],
//     allowedHeaders: [
//       "Access-Control-Allow-Origin",
//       "Content-Type",
//       "Authorization",
//     ],
//   })
// );
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use("/uploads", express.static(__dirname + "/uploads")),
  app.use("/api", authRoute);
app.use("/api", postRoute);
app.use(errorHandler);
const port = process.env.PORT || 8000;
mongoose
  .connect(
    `mongodb+srv://${process.env.DATABASE_USER}:${process.env.DATABASE_PASSWORD}@cluster0.23eodhd.mongodb.net/${process.env.DATABASE}?retryWrites=true&w=majority`
  )
  .then(() => {
    app.listen(port);
    console.log("Connected");
  })
  .catch((error) => {
    throw error;
  });
