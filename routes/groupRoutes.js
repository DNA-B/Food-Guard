const express = require("express");
const router = express.Router();
const groupController = require("../controllers/groupController.js");
const foodController = require("../controllers/foodController.js");
const usersController = require("../controllers/userController.js");

/**
 * @swagger
 * /groups/invites:
 *   get:
 *     summary: Get group invite page
 *     tags:
 *       - Group
 *     responses:
 *       200:
 *         description: Invites page
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 *       500:
 *         description: Server error
 */
router.get("/invites", async (req, res) => {
  try {
    const userId = req.userId;
    const invites = await groupController.findAllPendingInvitesByUserId(userId);
    res.render("groups/invites", { invites: invites });
  } catch (error) {
    res.status(error.statusCode || 500).render("error", { message: error.message, layout: false });
  }
});

/**
 * @swagger
 * /groups/create:
 *   get:
 *     summary: Get group create page
 *     tags:
 *       - Group
 *     responses:
 *       200:
 *         description: Create group page
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 *       500:
 *         description: Server error
 */
router.get("/create", async (req, res) => {
  try {
    res.render("groups/create");
  } catch (error) {
    res.status(error.statusCode || 500).render("error", { message: error.message, layout: false });
  }
});

/**
 * @swagger
 * /groups/create:
 *   post:
 *     summary: Create a new group
 *     tags:
 *       - Group
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       302:
 *         description: Redirect to groups
 *         headers:
 *           Location:
 *             schema:
 *               type: string
 *       500:
 *         description: Server error
 */
router.post("/create", async (req, res) => {
  try {
    const { name, description } = req.body;
    const userId = req.userId;
    await groupController.createGroup(name, description, userId);
    res.redirect("/groups");
  } catch (error) {
    res.status(error.statusCode || 500).render("error", { message: error.message, layout: false });
  }
});

/**
 * @swagger
 * /groups:
 *   get:
 *     summary: Find all groups for current user
 *     tags:
 *       - Group
 *     responses:
 *       200:
 *         description: Groups list page
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 *       500:
 *         description: Server error
 */
router.get("/", async (req, res) => {
  try {
    const userId = req.userId;
    const groups = await groupController.findAllGroupByUserId(userId);
    const isExistInvites = await groupController.existPendingInvitesByUserId(userId);
    res.render("groups/index", {
      groups: groups,
      isExistInvites: isExistInvites,
    });
  } catch (error) {
    res.status(error.statusCode || 500).render("error", { message: error.message, layout: false });
  }
});

/**
 * @swagger
 * /groups/{id}:
 *   get:
 *     summary: Find one group by id
 *     tags:
 *       - Group
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Group detail page
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 *       500:
 *         description: Server error
 */
router.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const group = await groupController.findGroupById(id);
    res.render("groups/detail", { group: group });
  } catch (error) {
    res.status(error.statusCode || 500).render("error", { message: error.message, layout: false });
  }
});

/**
 * @swagger
 * /groups/{id}/edit:
 *   get:
 *     summary: Get edit group page
 *     tags:
 *       - Group
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Edit group page
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 *       500:
 *         description: Server error
 */
router.get("/:id/edit", async (req, res) => {
  try {
    const id = req.params.id;
    const group = await groupController.findGroupById(id);
    res.render("groups/edit", { group: group });
  } catch (error) {
    res.status(error.statusCode || 500).render("error", { message: error.message, layout: false });
  }
});

/**
 * @swagger
 * /groups/{id}/edit:
 *   put:
 *     summary: Edit group
 *     tags:
 *       - Group
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       302:
 *         description: Redirect to group detail
 *         headers:
 *           Location:
 *             schema:
 *               type: string
 *       500:
 *         description: Server error
 */
router.put("/:id/edit", async (req, res) => {
  try {
    const id = req.params.id;
    const group = await groupController.findGroupById(id);

    if (!group) {
      const error = new Error("그룹을 찾을 수 없습니다.");
      error.statusCode = 404;
      throw error;
    }

    const { name, description } = req.body;
    await groupController.updateGroup(id, name, description);
    res.redirect(`/groups/${id}`);
  } catch (error) {
    res.status(error.statusCode || 500).render("error", { message: error.message, layout: false });
  }
});

/**
 * @swagger
 * /groups/{id}/foods:
 *   get:
 *     summary: Get all foods in specific group
 *     tags:
 *       - Group
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Group foods page
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 *       500:
 *         description: Server error
 */
router.get("/:id/foods", async (req, res) => {
  try {
    const id = req.params.id;
    const group = await groupController.findGroupById(id);
    const foods = await foodController.findAllFoodByGroupId(id);
    res.render("groups/foods", { groupName: group.name, foods: foods });
  } catch (error) {
    res.status(error.statusCode || 500).render("error", { message: error.message, layout: false });
  }
});

/**
 * @swagger
 * /groups/{id}/users:
 *   get:
 *     summary: Get all users in specific group
 *     tags:
 *       - Group
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Group users page
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 *       500:
 *         description: Server error
 */
router.get("/:id/users", async (req, res) => {
  try {
    const id = req.params.id;
    const result = await usersController.findAllUsersByGroupId(id);
    res.render("groups/users", {
      users: result.users,
      managerId: result.managerId,
    });
  } catch (error) {
    res.status(error.statusCode || 500).render("error", { message: error.message, layout: false });
  }
});

/**
 * @swagger
 * /groups/{id}/exit:
 *   post:
 *     summary: Exit group
 *     tags:
 *       - Group
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       302:
 *         description: Redirect to groups
 *         headers:
 *           Location:
 *             schema:
 *               type: string
 *       500:
 *         description: Server error
 */
router.post("/:id/exit", async (req, res) => {
  try {
    const id = req.params.id;
    const userId = req.userId;
    await groupController.exitGroup(id, userId);
    res.redirect("/groups");
  } catch (error) {
    res.status(error.statusCode || 500).render("error", { message: error.message, layout: false });
  }
});

module.exports = router;
