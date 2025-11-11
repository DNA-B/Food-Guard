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
router.post("/:id/accept", async (req, res) => {
  try {
    const id = req.params.id;
    const groupId = req.params.group_id;
    await inviteController.acceptInviteById(id, groupId);
    res.redirect(`/groups/invites`);
  } catch (error) {
    res
      .status(error.statusCode || 500)
      .render("error", { message: error.message, layout: false });
  }
});

// invite reject process
router.post("/:id/reject", async (req, res) => {
  try {
    const id = req.params.id;
    await inviteController.rejectInviteById(id);
    res.redirect(`/groups/invites`);
  } catch (error) {
    res
      .status(error.statusCode || 500)
      .render("error", { message: error.message, layout: false });
  }
});

// // find all invite
// router.get("/", async (req, res) => {
//   try {
//     const userId = req.userId;
//     const groupId = req.params.group_id;
//     const inviteList = await inviteController.findAllInviteById(userId);
//     res.render("groups/invites/index", { inviteList, groupId });
//   } catch (error) {
//     res
//       .status(error.statusCode || 500)
//       .render("error", { message: error.message, layout: false });
//   }
// });

// // find one invite
// router.get("/:id", async (req, res) => {
//   try {
//     const id = req.params.id;
//     const invite = await inviteController.acceptInviteById(id);

//     console.log("invite:", invite);
//     res.render("invites/detail", {
//       invite: invite,
//       author: invite.author.username,
//     });
//   } catch (error) {
//     res
//       .status(error.statusCode || 500)
//       .render("error", { message: error.message, layout: false });
//   }
// });

module.exports = router;
