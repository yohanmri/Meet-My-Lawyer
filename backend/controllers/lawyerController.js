import lawyerModel from "../models/lawyerModel.js";

const changeAvailablity = async (req, res) => {
  try {
    const { lawyerId } = req.body;

    const lawyerData = await lawyerModel.findById(lawyerId);
    await lawyerModel.findByIdAndUpdate(lawyerId, {
      available: !lawyerData.available,
    });
    res.json({ success: true, Message: "Availablity Changed" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export { changeAvailablity };
