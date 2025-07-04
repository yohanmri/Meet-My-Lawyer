import lawyerModel from "../models/lawyerModel.js";

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

export { changeAvailability, lawyerList };
