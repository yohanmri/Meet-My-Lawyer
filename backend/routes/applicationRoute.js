import express from "express";
import { addApplication } from "../controllers/applicationController.js";
import applicationModel from "../models/applicationModel.js";
import authAdmin from "../middlewares/authAdmin.js"; // Your admin auth middleware
import upload from "../middlewares/multer.js";

const applicationRouter = express.Router();

// Route for submitting application with file uploads
applicationRouter.post(
    "/add-application",
    upload.fields([
        { name: 'application_image', maxCount: 1 },
        { name: 'application_license_certificate', maxCount: 1 },
        { name: 'application_birth_certificate', maxCount: 1 },
        { name: 'application_legal_professionals_certificate', maxCount: 10 }
    ]),
    addApplication
);

// Route for getting all applications (for admin)
applicationRouter.get("/get-applications", authAdmin, async (req, res) => {
    try {
        const applications = await applicationModel.find({}).sort({ application_date: -1 });
        
        res.json({
            success: true,
            applications,
            message: "Applications retrieved successfully"
        });
    } catch (error) {
        console.error("Error fetching applications:", error);
        res.json({
            success: false,
            message: error.message
        });
    }
});

export default applicationRouter;