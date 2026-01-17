const express = require("express");
const router = express.Router({ mergeParams: true }); // 상위 라우터(group)에 있는 파라미터 전달 받기
const inviteController = require("../controllers/inviteController");

// get invite create page
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

// invite create process
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

// invite accept process
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

// invite reject process
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
