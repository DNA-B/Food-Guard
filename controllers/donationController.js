const Donation = require("../models/donationModel");
const Food = require("../models/foodModel");

const createDonation = async (title, content, foodId, userId) => {
  if (!title) {
    const error = new Error("필수 조건을 모두 입력해주세요.");
    error.statusCode = 422;
    throw error;
  }

  const newDonation = new Donation({
    title: title,
    content: content,
    author: userId,
    food: foodId,
  });

  const savedDonation = await newDonation.save();
  console.log("Saved Donation:", savedDonation);
};

const findAllDonation = async () => {
  const findDonations = await Donation.find();

  if (!findDonations) {
    const error = new Error("나눔을 찾을 수 없습니다.");
    error.statusCode = 404;
    throw error;
  }

  return findDonations;
};

const findAllDonationByUserId = async (userId) => {
  const findDonations = await Donation.find({ user: userId });

  if (!findDonations) {
    const error = new Error("나눔을 찾을 수 없습니다.");
    error.statusCode = 404;
    throw error;
  }

  return findDonations;
};

const findDonationById = async (id) => {
  const findDonation = await Donation.findById(id)
    .populate("author", "username")
    .populate("food", "name description expiryAt");

  if (!findDonation) {
    const error = new Error("나눔을 찾을 수 없습니다.");
    error.statusCode = 404;
    throw error;
  }

  return findDonation;
};

const updateDonation = async (id, title, content) => {
  if (!id) {
    const error = new Error("나눔을 찾을 수 없습니다.");
    error.statusCode = 404;
    throw error;
  }

  await Donation.updateOne(
    { _id: id }, // filter
    {
      // update field
      title: title,
      content: content,
    }
  );
};

const deleteDonation = async (id) => {
  const donation = await Donation.findById(id);

  if (!donation) {
    const error = new Error("나눔을 찾을 수 없습니다.");
    error.statusCode = 404;
    throw error;
  }

  await Donation.deleteOne({ _id: id });
};

module.exports = {
  createDonation,
  findAllDonation,
  findAllDonationByUserId,
  findDonationById,
  updateDonation,
  deleteDonation,
};
