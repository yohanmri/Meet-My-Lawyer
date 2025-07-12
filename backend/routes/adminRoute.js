import express from "express";
import {
  addLawyer,
  adminDashboard,
  allLawyers,
  appointmentCancel,
  appointmentsAdmin,
  loginAdmin,
} from "../controllers/adminController.js";
import upload from "../middlewares/multer.js";
import authAdmin from "../middlewares/authAdmin.js";
import { changeAvailability } from "../controllers/lawyerController.js";

const adminRouter = express.Router();

console.log("Admin router loaded");

adminRouter.post(
  "/add-lawyer",
  (req, res, next) => {
    console.log("POST /add-lawyer route matched!");
    next();
  },
  authAdmin,
  upload.single("image"),
  addLawyer
);

adminRouter.post("/login", loginAdmin);
adminRouter.post("/all-lawyers", authAdmin, allLawyers);
adminRouter.post("/change-availability", authAdmin, changeAvailability);
adminRouter.get('/appointments', authAdmin, appointmentsAdmin)
adminRouter.post('/cancel-appointment', authAdmin, appointmentCancel)
adminRouter.get('/dashboard', authAdmin, adminDashboard)

export default adminRouter;
