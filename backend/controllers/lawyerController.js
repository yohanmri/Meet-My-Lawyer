import lawyerModel from "../models/lawyerModel.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import appointmentModel from "../models/appointmentModel.js";

const changeAvailability = async (req, res) => {
  try {
    const { lawyerId } = req.body;

    const lawyerData = await lawyerModel.findById(lawyerId);
    await lawyerModel.findByIdAndUpdate(lawyerId, {
      available: !lawyerData.available,
    });
    res.json({ success: true, message: "Availability Changed" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const lawyerList = async (req, res) => {
  try {
    const lawyers = await lawyerModel.find({}).select(["-password", "-email"]); //we exclude email and password
    res.json({ success: true, lawyers });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

//API for lawyer Login

const loginLawyer = async (req, res) => {
  try {
    const { email, password } = req.body
    const lawyer = await lawyerModel.findOne({ email })

    if (!lawyer) {
      return res.json({ success: false, message: 'Invalid Credentials' })
    }

    const isMatch = await bcrypt.compare(password, lawyer.password)

    if (isMatch) {

      const token = jwt.sign({ id: lawyer._id }, process.env.JWT_SECRET)

      res.json({ success: true, token })

    } else {
      return res.json({ success: false, message: 'Invalid Credentials' })

    }

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
}

//API to get lawyer appointments for lawyer panel

const appointmentsLawyer = async (req, res) => {
  try {
    const { lawyerId } = req.body
    const appointments = await appointmentModel.find({ lawyerId })

    res.json({ success: true, appointments })
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
}
// API to mark appointment completed for lawyer panal
const appointmentComplete = async (req, res) => {
  try {

    const { lawyerId, appointmentId } = req.body

    const appointmentData = await appointmentModel.findById(appointmentId)


    //With whom the appointment is booked? same lawyer has logged in?
    if (appointmentData && appointmentData.lawyerId == lawyerId) {

      await appointmentModel.findByIdAndUpdate(appointmentId, { isCompleted: true })
      return res.json({ success: true, message: 'Appointment Completed' })

    } else {
      return res.json({ success: false, message: 'Mark Failed' })

    }

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
}



// API to mark appointment cancel for lawyer panal
const appointmentCancel = async (req, res) => {
  try {

    const { lawyerId, appointmentId } = req.body

    const appointmentData = await appointmentModel.findById(appointmentId)


    //With whom the appointment is booked? same lawyer has logged in?
    if (appointmentData && appointmentData.lawyerId == lawyerId) {

      await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true })
      return res.json({ success: true, message: 'Appointment Cancelled' })

    } else {
      return res.json({ success: false, message: 'Cancellation Failed' })

    }

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
}

export { changeAvailability, lawyerList, loginLawyer, appointmentsLawyer, appointmentCancel, appointmentComplete };
