import {
    addApplication
} from "../controllers/applicationController.js"
import express from "express";
import upload from "../middlewares/multer.js";
import { getApplications } from "../controllers/adminController.js";
import authAdmin from "../middlewares/authAdmin.js"; // ADD THIS LINE

const applicationRouter = express.Router();

console.log("Application router loaded");

applicationRouter.post("/add-application",
    upload.fields([
        { name: 'application_image', maxCount: 1 },
        { name: 'application_license_certificate', maxCount: 1 },
        { name: 'application_birth_certificate', maxCount: 1 },
        { name: 'application_legal_professionals_certificate', maxCount: 10 }
    ]),
    addApplication
);

applicationRouter.get('/get-applications', authAdmin, getApplications);

export default applicationRouter;