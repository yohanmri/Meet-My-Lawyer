import validator from "validator";
import bcrypt from "bcrypt";
import { v2 as cloudinary } from "cloudinary";
import lawyerModel from "../models/lawyerModel.js";
import jwt from "jsonwebtoken";
import appointmentModel from "../models/appointmentModel.js";
import userModel from "../models/userModel.js";
import applicationModel from "../models/applicationModel.js";

// API for adding lawyer
const addLawyer = async (req, res) => {
  try {
    console.log("Request received at addLawyer controller");

    const {
      name,
      email,
      password,
      phone,
      office_phone,
      speciality,
      gender,
      dob,
      degree,
      district,
      license_number,
      bar_association,
      experience,
      languages_spoken,
      about,
      available,
      legal_professionals,
      fees,
      total_reviews,
      address,
      latitude,
      longitude,
      court1,
      court2,
      date,
      slots_booked,
      method,
      online_link,
    } = req.body;

    const imageFile = req.file;

    console.log("Image file:", imageFile);

    // checking for required lawyer data only
    if (
      !name ||
      !email ||
      !password ||
      !speciality ||
      !district ||
      !license_number
    ) {
      return res.json({ success: false, message: "Missing Required Details" });
    }

    // validating email format
    if (!validator.isEmail(email)) {
      return res.json({
        success: false,
        message: "Please Enter a valid Email",
      });
    }

    // validating strong Password
    if (password.length < 8) {
      return res.json({
        success: false,
        message: "Please Enter a Strong Password",
      });
    }

    // Check if lawyer with this email already exists
    const existingLawyer = await lawyerModel.findOne({ email });
    if (existingLawyer) {
      return res.json({
        success: false,
        message: "Lawyer with this email already exists",
      });
    }

    // Online Link validation
    if (method === "online" && !online_link) {
      return res.json({
        success: false,
        message: "Online link is required for online consultations",
      });
    }

    // Hashing Lawyer's password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    let imageUrl = '';

    // Upload Image to cloudinary if image exists
    if (imageFile) {
      try {
        console.log("Processing image upload...");
        console.log("Image buffer length:", imageFile.buffer.length);
        console.log("Image mimetype:", imageFile.mimetype);

        // Convert buffer to base64 string for Cloudinary
        const b64 = Buffer.from(imageFile.buffer).toString("base64");
        const dataURI = "data:" + imageFile.mimetype + ";base64," + b64;

        console.log("DataURI created, length:", dataURI.length);

        const imageUpload = await cloudinary.uploader.upload(dataURI, {
          resource_type: "image",
          folder: "lawyers", // Optional: organize images in folders
          timeout: 60000, // 60 second timeout
        });

        imageUrl = imageUpload.secure_url;
        console.log("Image uploaded successfully:", imageUrl);

      } catch (uploadError) {
        console.log("Image upload error:", uploadError);
        return res.json({ success: false, message: "Image upload failed: " + uploadError.message });
      }
    } else {
      console.log("No image file provided - proceeding without image");
    }

    const lawyerData = {
      name,
      email,
      image: imageUrl,
      password: hashedPassword,
      phone,
      office_phone,
      speciality,
      gender,
      dob,
      degree,
      district,
      license_number,
      bar_association,
      experience,
      languages_spoken: Array.isArray(languages_spoken) ? languages_spoken : [languages_spoken].filter(Boolean),
      about: about || 'No additional information provided',
      available: available !== undefined ? available : true,
      legal_professionals,
      fees: fees ? Number(fees) : 0,
      total_reviews: total_reviews || 0,
      address: typeof address === 'string' ? JSON.parse(address) : address,
      latitude: latitude ? Number(latitude) : 0,
      longitude: longitude ? Number(longitude) : 0,
      court1,
      court2,
      date: Date.now(),
      slots_booked: slots_booked || {},
      method: method || 'both',
      online_link: online_link || '',
    };

    try {
      const newLawyer = new lawyerModel(lawyerData);
      await newLawyer.save();
      console.log("Lawyer saved successfully");
      res.json({ success: true, message: "Lawyer Added" });
    } catch (saveError) {
      console.log("Database save error:", saveError);

      // Handle specific MongoDB errors
      if (saveError.code === 11000) {
        const field = Object.keys(saveError.keyValue)[0];
        const value = saveError.keyValue[field];
        return res.json({
          success: false,
          message: `A lawyer with this ${field} (${value}) already exists`
        });
      }

      return res.json({
        success: false,
        message: "Failed to save lawyer: " + saveError.message
      });
    }

  } catch (error) {
    console.log("Error:", error);
    res.json({ success: false, message: error.message });
  }
};

// API For admin Login
const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (
      email === process.env.ADMIN_EMAIL &&
      password === process.env.ADMIN_PASSWORD
    ) {
      const token = jwt.sign(email + password, process.env.JWT_SECRET);
      res.json({ success: true, token });
    } else {
      res.json({ success: false, message: "Invalid credentials" });
    }
  } catch (error) {
    console.log("Error:", error);
    res.json({ success: false, message: error.message });
  }
};

//API to get all lawyers list for admin panel
const allLawyers = async (req, res) => {
  try {
    const lawyers = await lawyerModel.find({}).select("-password");
    res.json({ success: true, lawyers });
  } catch (error) {
    console.log("Error:", error);
    res.json({ success: false, message: error.message });
  }
};

// API to get all appointments list
const appointmentsAdmin = async (req, res) => {
  try {
    const appointments = await appointmentModel.find({})
    res.json({ success: true, appointments })
  } catch (error) {
    console.log("Error:", error);
    res.json({ success: false, message: error.message });
  }
}

//API for appointment cancellation
const appointmentCancel = async (req, res) => {
  try {
    const { appointmentId } = req.body

    const appointmentData = await appointmentModel.findById(appointmentId)

    await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true })

    //Releasing Lawyers slot
    const { lawyerId, slotDate, slotTime } = appointmentData

    const lawyerData = await lawyerModel.findById(lawyerId)

    let slots_booked = lawyerData.slots_booked

    slots_booked[slotDate] = slots_booked[slotDate].filter(e => e !== slotTime)

    await lawyerModel.findByIdAndUpdate(lawyerId, { slots_booked })

    res.json({ success: true, message: 'Appointment Cancelled' })

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
}

// API to get dashboard data for admin panel
const adminDashboard = async (req, res) => {
  try {
    const lawyers = await lawyerModel.find({}) //can access all the lawyers here
    const users = await userModel.find({}) //can access all the users
    const appointments = await appointmentModel.find({}) //can access all appointments

    const dashData = {
      lawyers: lawyers.length,
      appointments: appointments.length,
      clients: users.length,
      latestAppointments: appointments.reverse().slice(0, 5)
    }

    res.json({ success: true, dashData })

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
}

//API to get all the applications from the lawyers
const getApplications = async (req, res) => {
  try {
    const applications = await applicationModel.find().sort({ application_date: -1 }); // latest first
    res.json({ success: true, applications });
  } catch (error) {
    console.error("Error fetching applications:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// API to get single lawyer details for editing
const getLawyer = async (req, res) => {
  try {
    const { lawyerId } = req.params;
    const lawyer = await lawyerModel.findById(lawyerId).select("-password");

    if (!lawyer) {
      return res.json({ success: false, message: "Lawyer not found" });
    }

    res.json({ success: true, lawyer });
  } catch (error) {
    console.log("Error:", error);
    res.json({ success: false, message: error.message });
  }
};

// API to update lawyer details (now includes password updates)
const updateLawyer = async (req, res) => {
  try {
    console.log("Request received at updateLawyer controller");

    const { lawyerId } = req.params;
    const {
      name,
      email,
      password, // Added password field
      phone,
      office_phone,
      speciality,
      gender,
      dob,
      degree,
      district,
      license_number,
      bar_association,
      experience,
      languages_spoken,
      about,
      available,
      legal_professionals,
      fees,
      address,
      latitude,
      longitude,
      court1,
      method,
      online_link,
    } = req.body;

    const imageFile = req.file;

    // Find existing lawyer
    const existingLawyer = await lawyerModel.findById(lawyerId);
    if (!existingLawyer) {
      return res.json({ success: false, message: "Lawyer not found" });
    }

    // Check if email is being changed and if new email already exists
    if (email !== existingLawyer.email) {
      const emailExists = await lawyerModel.findOne({ email, _id: { $ne: lawyerId } });
      if (emailExists) {
        return res.json({
          success: false,
          message: "Another lawyer with this email already exists",
        });
      }
    }

    // Validate and hash new password if provided
    let hashedPassword = existingLawyer.password; // Keep existing password by default
    if (password && password.trim() !== '') {
      if (password.length < 8) {
        return res.json({
          success: false,
          message: "Password must be at least 8 characters long",
        });
      }

      const salt = await bcrypt.genSalt(10);
      hashedPassword = await bcrypt.hash(password, salt);
      console.log("New password hashed for lawyer:", name);
    }

    let imageUrl = existingLawyer.image; // Keep existing image by default

    // Upload new image if provided
    if (imageFile) {
      try {
        console.log("Processing image upload for update...");
        const b64 = Buffer.from(imageFile.buffer).toString("base64");
        const dataURI = "data:" + imageFile.mimetype + ";base64," + b64;

        const imageUpload = await cloudinary.uploader.upload(dataURI, {
          resource_type: "image",
          folder: "lawyers",
          timeout: 60000,
        });

        imageUrl = imageUpload.secure_url;
        console.log("New image uploaded successfully:", imageUrl);

      } catch (uploadError) {
        console.log("Image upload error:", uploadError);
        return res.json({ success: false, message: "Image upload failed: " + uploadError.message });
      }
    }

    const updateData = {
      name,
      email,
      image: imageUrl,
      password: hashedPassword, // Now includes password updates
      phone,
      office_phone,
      speciality,
      gender,
      dob,
      degree,
      district,
      license_number,
      bar_association,
      experience,
      languages_spoken: Array.isArray(languages_spoken) ? languages_spoken : [languages_spoken].filter(Boolean),
      about: about || 'No additional information provided',
      available: available !== undefined ? available : true,
      legal_professionals,
      fees: fees ? Number(fees) : 0,
      address: typeof address === 'string' ? JSON.parse(address) : address,
      latitude: latitude ? Number(latitude) : 0,
      longitude: longitude ? Number(longitude) : 0,
      court1,
      method: method || 'both',
      online_link: online_link || '',
    };

    await lawyerModel.findByIdAndUpdate(lawyerId, updateData, { new: true });

    res.json({ success: true, message: "Lawyer updated successfully" });

  } catch (error) {
    console.log("Error:", error);
    res.json({ success: false, message: error.message });
  }
};

// API to reset lawyer password (separate function for admin use)
const resetLawyerPassword = async (req, res) => {
  try {
    const { lawyerId, newPassword } = req.body;

    if (!lawyerId || !newPassword) {
      return res.json({ success: false, message: "Lawyer ID and new password are required" });
    }

    if (newPassword.length < 8) {
      return res.json({ success: false, message: "Password must be at least 8 characters long" });
    }

    // Check if lawyer exists
    const lawyer = await lawyerModel.findById(lawyerId);
    if (!lawyer) {
      return res.json({ success: false, message: "Lawyer not found" });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update the lawyer's password
    await lawyerModel.findByIdAndUpdate(lawyerId, { password: hashedPassword });

    console.log(`Password reset for lawyer: ${lawyer.name} (${lawyer.email})`);
    res.json({ success: true, message: "Password reset successfully" });

  } catch (error) {
    console.log("Error:", error);
    res.json({ success: false, message: error.message });
  }
};

// API to check if lawyer has password (for admin panel UI)
const checkLawyerPassword = async (req, res) => {
  try {
    const { lawyerId } = req.params;

    const lawyer = await lawyerModel.findById(lawyerId).select('name email password');

    if (!lawyer) {
      return res.json({ success: false, message: "Lawyer not found" });
    }

    res.json({
      success: true,
      hasPassword: !!lawyer.password,
      lawyerName: lawyer.name,
      lawyerEmail: lawyer.email
    });

  } catch (error) {
    console.log("Error:", error);
    res.json({ success: false, message: error.message });
  }
};

// API to delete lawyer
const deleteLawyer = async (req, res) => {
  try {
    const { lawyerId } = req.params;

    // Check if lawyer exists
    const lawyer = await lawyerModel.findById(lawyerId);
    if (!lawyer) {
      return res.json({ success: false, message: "Lawyer not found" });
    }

    // Delete the lawyer
    await lawyerModel.findByIdAndDelete(lawyerId);

    // Optional: You might want to handle related appointments here
    // await appointmentModel.deleteMany({ lawyerId });

    res.json({ success: true, message: "Lawyer deleted successfully" });

  } catch (error) {
    console.log("Error:", error);
    res.json({ success: false, message: error.message });
  }
};

export {
  addLawyer,
  loginAdmin,
  allLawyers,
  appointmentsAdmin,
  appointmentCancel,
  adminDashboard,
  getApplications,
  getLawyer,
  updateLawyer,
  deleteLawyer,
  resetLawyerPassword,
  checkLawyerPassword
};