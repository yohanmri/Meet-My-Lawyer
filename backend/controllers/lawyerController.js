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

//API to get dashboard data for lawyerpanel

const lawyerDashboard = async (req, res) => {
  try {

    const { lawyerId } = req.body

    const appointments = await appointmentModel.find({ lawyerId })

    let earnings = 0

    appointments.map((item) => {
      if (item.isCompleted || item.payment) {
        earnings += item.amount
      }
    })

    let clients = []

    appointments.map((item) => {
      if (!clients.includes(item.userId)) {
        clients.push(item.userId)
      }
    })

    const dashData = {
      earnings,
      appointments: appointments.length,
      clients: clients.length,
      latestAppointments: appointments.reverse().slice(0, 5)
    }

    res.json({ success: true, dashData })

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
}

// API to get lawyer profile for lawyer panel

const lawyerProfile = async (req, res) => {
  try {

    const { lawyerId } = req.body
    const profileData = await lawyerModel.findById(lawyerId).select('-password')

    res.json({ success: true, profileData })

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
}


// API to update lawyer profile data from lawyer panel

const updateLawyerProfile = async (req, res) => {

  try {

    const { lawyerId, fees, address, available } = req.body

    await lawyerModel.findByIdAndUpdate(lawyerId, { fees, address, available })

    res.json({ success: true, message: ' Profile Updated' })

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
}


export {
  changeAvailability,
  lawyerList,
  loginLawyer,
  appointmentsLawyer,
  appointmentCancel,
  appointmentComplete,
  lawyerDashboard,
  lawyerProfile,
  updateLawyerProfile,
};
