const express = require("express");
const router = express.Router({ mergeParams: true }); // 상위 라우터(group)에 있는 파라미터 전달 받기
const inviteController = require("../controllers/inviteController");

/**
 * @swagger
 * /groups/{group_id}/invites/create:
 *   get:
 *     summary: Get invite create page
 *     tags:
 *       - Invite
 *     parameters:
 *       - in: path
 *         name: group_id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Create invite page
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 *       500:
 *         description: Server error
 */
router.get("/create", async (req, res) => {
  try {
    const groupId = req.params.group_id;
    res.render("groups/inviteCreate", { groupId });
  } catch (error) {
    res
      .status(error.statusCode || 500)
      .render("error", { message: error.message, layout: false });
  }
});

/**
 * @swagger
 * /groups/{group_id}/invites/create:
 *   post:
 *     summary: Create a new invite
 *     tags:
 *       - Invite
 *     parameters:
 *       - in: path
 *         name: group_id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             properties:
 *               nickname:
 *                 type: string
 *     responses:
 *       302:
 *         description: Redirect to group
 *         headers:
 *           Location:
 *             schema:
 *               type: string
 *       500:
 *         description: Server error
 */
router.post("/create", async (req, res) => {
  try {
    const nickname = req.body.nickname;
    const userId = req.userId;
    const groupId = req.params.group_id;
    await inviteController.createInvite(nickname, userId, groupId);
    res.redirect(`/groups/${groupId}`);
  } catch (error) {
    res
      .status(error.statusCode || 500)
      .render("error", { message: error.message, layout: false });
  }
});

/**
 * @swagger
 * /groups/{group_id}/invites/{invite_id}/accept:
 *   post:
 *     summary: Accept invite
 *     tags:
 *       - Invite
 *     parameters:
 *       - in: path
 *         name: group_id
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: invite_id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       302:
 *         description: Redirect to invites
 *         headers:
 *           Location:
 *             schema:
 *               type: string
 *       500:
 *         description: Server error
 */
router.post("/:invite_id/accept", async (req, res) => {
  try {
    const { group_id: groupId, invite_id: inviteId } = req.params;
    await inviteController.acceptInviteById(groupId, inviteId);
    res.redirect(`/groups/invites`);
  } catch (error) {
    res
      .status(error.statusCode || 500)
      .render("error", { message: error.message, layout: false });
  }
});

/**
 * @swagger
 * /groups/{group_id}/invites/{invite_id}/reject:
 *   post:
 *     summary: Reject invite
 *     tags:
 *       - Invite
 *     parameters:
 *       - in: path
 *         name: group_id
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: invite_id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       302:
 *         description: Redirect to invites
 *         headers:
 *           Location:
 *             schema:
 *               type: string
 *       500:
 *         description: Server error
 */
router.post("/:invite_id/reject", async (req, res) => {
  try {
    const inviteId = req.params.invite_id;
    await inviteController.rejectInviteById(inviteId);
    res.redirect(`/groups/invites`);
  } catch (error) {
    res
      .status(error.statusCode || 500)
      .render("error", { message: error.message, layout: false });
  }
});

module.exports = router;
