const Donation = require("../models/donationModel");
const { Food, FOOD_STATUS } = require("../models/foodModel");

const createDonation = async (title, content, foodId, userId) => {
  if (!title || !foodId) {
    const error = new Error("필수 조건을 모두 입력해주세요.");
    error.statusCode = 422;
    throw error;
  }

  const food = await Food.findById(foodId);
  if (!food) {
    const error = new Error("해당 음식을 찾을 수 없습니다.");
    error.statusCode = 404;
    throw error;
  }

  food.status = FOOD_STATUS.DONATED;
  await food.save();

  const newDonation = new Donation({
    title,
    content,
    author: userId,
    food: foodId,
  });

  await newDonation.save();
};

const findAllDonation = async () => {
  const donations = (await Donation.find().populate("food", "status")).filter(
    (donation) => donation.food.status === "donated",
  );

  if (!donations) {
    const error = new Error("나눔을 찾을 수 없습니다.");
    error.statusCode = 404;
    throw error;
  }

  return donations;
};

const findAllDonationByUserId = async (userId) => {
  const donations = await Donation.find({ user: userId });

  if (!donations) {
    const error = new Error("나눔을 찾을 수 없습니다.");
    error.statusCode = 404;
    throw error;
  }

  return donations;
};

const findDonationById = async (id) => {
  const donation = await Donation.findById(id).populate("author", "username").populate("food");

  if (!donation) {
    const error = new Error("나눔을 찾을 수 없습니다.");
    error.statusCode = 404;
    throw error;
  }

  return donation;
};

const updateDonation = async (id, title, content, foodId) => {
  const donation = await Donation.findById(id);

  if (!donation) {
    const error = new Error("나눔을 찾을 수 없습니다.");
    error.statusCode = 404;
    throw error;
  }

  donation.title = title;
  donation.content = content;
  donation.food = foodId;
  await donation.save();
};

const deleteDonation = async (id) => {
  const donation = await Donation.findById(id);

  if (!donation) {
    const error = new Error("나눔을 찾을 수 없습니다.");
    error.statusCode = 404;
    throw error;
  }

  await donation.deleteOne();
};

module.exports = {
  createDonation,
  findAllDonation,
  findAllDonationByUserId,
  findDonationById,
  updateDonation,
  deleteDonation,
};
