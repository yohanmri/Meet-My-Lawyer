import validator from "validator";
import bcrypt from "bcrypt";
import { v2 as cloudinary } from "cloudinary";
import lawyerModel from "../models/lawyerModel.js";
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
      !license_number ||
      !imageFile
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

    // Hashing Lawyer's password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Upload Image to cloudinary
    const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
      resource_type: "image",
    });
    const imageUrl = imageUpload.secure_url;

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
      languages_spoken,
      about,
      available,
      legal_professionals,
      fees,
      total_reviews: total_reviews || 0,
      address: JSON.parse(address),
      latitude,
      longitude,
      court1,
      court2,
      date: Date.now(),
      slots_booked: slots_booked || {},
    };

    const newLawyer = new lawyerModel(lawyerData);
    await newLawyer.save();

    res.json({ success: true, message: "Lawyer Added" });

    //
  } catch (error) {
    console.log("Error:", error);
    res.json({ success: false, message: error.message });
  }
};

export { addLawyer };
