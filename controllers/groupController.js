const Group = require("../models/groupModel");

const findAllGroup = async (userId) => {
  const findGroups = await Group.find({ users: userId });

  if (!findGroups) {
    throw new Error({ message: "그룹을 찾을 수 없습니다.", statusCode: 404 });
  }

  return findGroups;
};

const findOneGroup = async (id) => {
  const findGroup = await Group.findById(id);

  if (!findGroup) {
    throw new Error({ message: "그룹을 찾을 수 없습니다.", statusCode: 404 });
  }

  return findGroup;
};

const createGroup = async (name, description, userId) => {
  if (!name) {
    throw new Error({
      message: "필수 조건을 모두 입력해주세요.",
      statusCode: 422,
    });
  }

  const newGroup = new Group({
    name: name,
    description: description,
    users: [userId],
  });

  const savedGroup = await newGroup.save();
  console.log("Saved Group:", savedGroup);
};

const updateOneGroup = async (id, name, description) => {
  if (!id) {
    throw new Error({ message: "그룹을 찾을 수 없습니다.", statusCode: 404 });
  }

  await Group.updateOne(
    { _id: id }, // filter
    {
      // update field
      name: name,
      description: description,
    }
  );
};

const deleteOneGroup = async (id) => {
  const group = Group.findById(id);

  if (!group) {
    throw new Error({ message: "그룹을 찾을 수 없습니다.", statusCode: 404 });
  }

  await Group.deleteOne(group);
  console.log("Delete Group - id: ", id);
};

module.exports = {
  findAllGroup,
  findOneGroup,
  createGroup,
  updateOneGroup,
  deleteOneGroup,
};
