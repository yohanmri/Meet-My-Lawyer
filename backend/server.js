import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";
import adminRouter from "./routes/adminRoute.js";
import lawyerRouter from "./routes/lawyerRoute.js";
import userRouter from "./routes/userRoute.js";
import applicationRouter from "./routes/applicationRoute.js";
import mongoose from "mongoose";

// app config
const app = express();
const port = process.env.PORT || 4000;

// Connect to database and fix old indexes
const initializeApp = async () => {
  try {
    await connectDB();
    await connectCloudinary();

    // Fix old indexes after database connection
    await dropOldIndexes();

  } catch (error) {
    console.log("Initialization error:", error);
  }
};

// Function to drop old problematic indexes
const dropOldIndexes = async () => {
  try {
    const db = mongoose.connection.db;

    // Drop old email index from applications collection
    try {
      await db.collection('applications').dropIndex('email_1');
      console.log('✅ Dropped old email_1 index from applications collection');
    } catch (error) {
      if (error.codeName === 'IndexNotFound') {
        console.log('ℹ️ email_1 index not found (already dropped or never existed)');
      } else {
        console.log('⚠️ Error dropping email_1 index:', error.message);
      }
    }

    // Drop old license number index if it exists
    try {
      await db.collection('applications').dropIndex('application_license_number_1');
      console.log('✅ Dropped old application_license_number_1 index');
    } catch (error) {
      if (error.codeName === 'IndexNotFound') {
        console.log('ℹ️ application_license_number_1 index not found');
      } else {
        console.log('⚠️ Error dropping license index:', error.message);
      }
    }

  } catch (error) {
    console.log('❌ Error in dropOldIndexes function:', error.message);
  }
};

// Initialize the app
initializeApp();

// middlewares
app.use(express.json());
app.use(cors());

// Add debugging middleware
app.use("/api/admin", function (req, res, next) {
  console.log(`Admin route hit: ${req.method} ${req.path}`);
  next();
});

// api endpoints
app.use("/api/admin", adminRouter);
app.use("/api/lawyer", lawyerRouter);
app.use("/api/user", userRouter);
app.use("/api/application", applicationRouter);

app.get("/", function (req, res) {
  res.send("API WORKING");
});

app.listen(port, function () {
  console.log("Server Started on port:", port);
});