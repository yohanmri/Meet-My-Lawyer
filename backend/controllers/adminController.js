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

    res.json({
      success: true,
      message: "All lawyer data received successfully",
      data: {
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
        imageFile: imageFile ? imageFile.filename : null,
      },
    });
  } catch (error) {
    console.log("Error:", error);
    res.json({ success: false, message: error.message });
  }
};

export { addLawyer };
