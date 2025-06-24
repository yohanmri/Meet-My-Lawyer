import mongoose from "mongoose";

const lawyerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String, required: true },
    office_phone: { type: String, required: false },
    image: { type: String, required: true },
    speciality: { type: String, required: true },
    gender: { type: String, required: true },
    dob: { type: String, default: "Not Selected" },
    degree: { type: String, required: true },
    district: { type: String, required: true },
    license_number: { type: String, required: true, unique: true },
    bar_association: { type: String, required: true },
    experience: { type: String, required: true },
    languages_spoken: { type: [String], required: true },
    about: { type: String, required: true },
    available: { type: Boolean, required: true },
    legal_professionals: { type: String, required: true },
    fees: { type: Number, required: true },
    total_reviews: { type: Number, default: 0 },
    address: { type: Object, required: true },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    court1: { type: String, required: true },
    court2: { type: String, required: false }, // Optional second court
    date: { type: Number, required: true },
    slots_booked: { type: Object, default: {} },
  },
  { minimize: false }
);

const lawyerModel =
  mongoose.models.lawyer || mongoose.model("lawyer", lawyerSchema);

export default lawyerModel;
