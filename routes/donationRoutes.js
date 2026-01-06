const express = require("express");
const router = express.Router();
const donationController = require("../controllers/donationController.js");
const foodController = require("../controllers/foodController.js");

// get create donation page
router.get("/create", async (req, res) => {
  try {
    const foods = await foodController.findAllFoodByUserId(req.userId);
    res.render("donations/create", { foods: foods });
  } catch (error) {
    res
      .status(error.statusCode || 500)
      .render("error", { message: error.message, layout: false });
  }
});

// donation create process
router.post("/create", async (req, res) => {
  try {
    const { title, content, foodId } = req.body;
    const userId = req.userId;
    await donationController.createDonation(title, content, foodId, userId);
    res.redirect("/donations");
  } catch (error) {
    res
      .status(error.statusCode || 500)
      .render("error", { message: error.message, layout: false });
  }
});

// find all donation
router.get("/", async (req, res) => {
  try {
    const donations = await donationController.findAllDonation();
    res.render("donations/index", { donations: donations });
  } catch (error) {
    res
      .status(error.statusCode || 500)
      .render("error", { message: error.message, layout: false });
  }
});

// find one donation
router.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const donation = await donationController.findDonationById(id);
    const isAuthor = req.userId === donation.author._id.toString();
    res.render("donations/detail", {
      donation,
      author: donation.author.username,
      isAuthor: isAuthor,
    });
  } catch (error) {
    res
      .status(error.statusCode || 500)
      .render("error", { message: error.message, layout: false });
  }
});

// get edit Donation page
router.get("/:id/edit", async (req, res) => {
  try {
    const id = req.params.id;
    const donation = await donationController.findDonationById(id);
    res.render("donations/edit", { donation: donation });
  } catch (error) {
    res
      .status(error.statusCode || 500)
      .render("error", { message: error.message, layout: false });
  }
});

// edit donation process
router.put("/:id/edit", async (req, res) => {
  try {
    const id = req.params.id;
    const donation = await donationController.findDonationById(id);

    if (!donation) {
      res
        .status(404)
        .render("error", { message: "나눔을 찾을 수 없습니다", layout: false });
    }

    const { title, content } = req.body;
    await donationController.updateDonation(id, title, content);
    res.redirect(`/donations/${id}`);
  } catch (error) {
    res
      .status(error.statusCode || 500)
      .render("error", { message: error.message, layout: false });
  }
});

// donation delete process
router.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const donation = await donationController.findDonationById(id);

    if (!donation) {
      res
        .status(404)
        .render("error", { message: "나눔을 찾을 수 없습니다", layout: false });
    }

    await donationController.deleteDonation(id);
    res.redirect("/donations");
  } catch (error) {
    res
      .status(error.statusCode || 500)
      .render("error", { message: error.message, layout: false });
  }
});

module.exports = router;
