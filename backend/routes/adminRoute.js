import express from "express";
import { addLawyer } from "../controllers/adminController.js";
import upload from "../middlewares/multer.js";

const adminRouter = express.Router();

console.log("Admin router loaded");

adminRouter.post(
  "/add-lawyer",
  (req, res, next) => {
    console.log("POST /add-lawyer route matched!");
    next();
  },
  upload.single("image"),
  addLawyer
);

export default adminRouter;
