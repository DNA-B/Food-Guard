const express = require("express");
const router = express.Router();
const groupController = require("../controllers/groupController.js");
const foodController = require("../controllers/foodController.js");
const usersController = require("../controllers/userController.js");

// get group invite page
router.get("/invites", async (req, res) => {
  try {
    const userId = req.userId;
    const invites = await groupController.findAllPendingInvitesByUserId(userId);
    res.render("groups/invites", { invites: invites });
  } catch (error) {
    res
      .status(error.statusCode || 500)
      .render("error", { message: error.message, layout: false });
  }
});

// get group create page
router.get("/create", async (req, res) => {
  try {
    res.render("groups/create");
  } catch (error) {
    res
      .status(error.statusCode || 500)
      .render("error", { message: error.message, layout: false });
  }
});

// group create process
router.post("/create", async (req, res) => {
  try {
    const { name, description } = req.body;
    const userId = req.userId;
    await groupController.createGroup(name, description, userId);
    res.redirect("/groups");
  } catch (error) {
    res
      .status(error.statusCode || 500)
      .render("error", { message: error.message, layout: false });
  }
});

// find all group include current user
router.get("/", async (req, res) => {
  try {
    const userId = req.userId;
    const groups = await groupController.findAllGroupByUserId(userId);
    const isExistInvites =
      await groupController.existPendingInvitesByUserId(userId);
    res.render("groups/index", {
      groups: groups,
      isExistInvites: isExistInvites,
    });
  } catch (error) {
    res
      .status(error.statusCode || 500)
      .render("error", { message: error.message, layout: false });
  }
});

// find one group by id
router.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const group = await groupController.findGroupById(id);
    res.render("groups/detail", { group: group });
  } catch (error) {
    res
      .status(error.statusCode || 500)
      .render("error", { message: error.message, layout: false });
  }
});

// get edit group page
router.get("/:id/edit", async (req, res) => {
  try {
    const id = req.params.id;
    const group = await groupController.findGroupById(id);
    res.render("groups/edit", { group: group });
  } catch (error) {
    res
      .status(error.statusCode || 500)
      .render("error", { message: error.message, layout: false });
  }
});

// edit group process
router.put("/:id/edit", async (req, res) => {
  try {
    const id = req.params.id;
    const group = await groupController.findGroupById(id);

    if (!group) {
      res
        .status(404)
        .render("error", { message: "그룹을 찾을 수 없습니다", layout: false });
    }

    const { name, description } = req.body;
    await groupController.updateGroup(id, name, description);
    res.redirect(`/groups/${id}`);
  } catch (error) {
    res
      .status(error.statusCode || 500)
      .render("error", { message: error.message, layout: false });
  }
});

// get all foods in specific group page
router.get("/:id/foods", async (req, res) => {
  try {
    const id = req.params.id;
    const group = await groupController.findGroupById(id);
    const foods = await foodController.findAllFoodByGroupId(id);
    res.render("groups/foods", { groupName: group.name, foods: foods });
  } catch (error) {
    res
      .status(error.statusCode || 500)
      .render("error", { message: error.message, layout: false });
  }
});

// get all users in specific group page
router.get("/:id/users", async (req, res) => {
  try {
    const id = req.params.id;
    const result = await usersController.findAllUsersByGroupId(id);
    res.render("groups/users", {
      users: result.users,
      managerId: result.managerId,
    });
  } catch (error) {
    res
      .status(error.statusCode || 500)
      .render("error", { message: error.message, layout: false });
  }
});

// exit group process
router.post("/:id/exit", async (req, res) => {
  try {
    const id = req.params.id;
    const userId = req.userId;
    await groupController.exitGroup(id, userId);
    res.redirect("/groups");
  } catch (error) {
    res
      .status(error.statusCode || 500)
      .render("error", { message: error.message, layout: false });
  }
});

module.exports = router;
