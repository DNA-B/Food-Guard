const User = require("../models/userModel");

const deleteOneUser = async (id) => {
  try {
    const user = await User.findById(id);

    if (!user) {
      res.status(404).render("error", { messga: "유저를 찾을 수 없습니다." });
    }

    await user.deleteOne();
    console.log("Delete User - id: ", id);
  } catch (error) {
    res.status(500).render("error", { message: error.message });
  }
};

module.exports = { deleteOneUser };
