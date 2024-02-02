// import { v2 as cloudinary } from "cloudinary";
const cloudinary = require("cloudinary").v2;
cloudinary.config({
  cloud_name: "dkplrcbjz",
  api_key: "437417583732476",
  api_secret: "bX2UrHR0_uqFmso_kHVEBphFABI",
});
module.exports = cloudinary;
