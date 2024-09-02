// const userModel = require("../models/userModel");
const userModel = require("../models/userModel");

const findByEmail = async (request, response) => {
  const { email } = request.params;

  const user = await userModel.findByEmail(email);

  if (!user) {
    return response.status(404).json({ message: "User not found" });
  }
  return response.status(200).json(user);
};

const saveUser = async (request, response) => {
  let user = {};

  if (request.body.id && request.body.id > 0) {
    user = await userModel.updateUser(request.body);
  } else {
    user = await userModel.createUser(request.body);
  }
  return response.status(200).json(user);
};

const signIn = async (request, response) => {
  const user = await userModel.signIn(request.body);

  if (!user) {
    return response
      .status(404)
      .json({ message: "Email or password incorrects" });
  }
  return response.status(200).json(user);
};

const deleteUser = async (request, response) => {
  const { id } = request.params;

  const user = await userModel.deleteUser(id);

  if (!user) {
    return response.status(404).json({ message: "User not found" });
  }
  return response.status(200).json(user);
};

const updateUserHelpinhosCreated = async (id) => {
  try {
    await userModel.updateUserHelpinhosCreated(id);
    return;
  } catch (error) {
    console.error("Error updating helpinhos created:", error);
  }
};

module.exports = {
  updateUserHelpinhosCreated,
  findByEmail,
  saveUser,
  signIn,
  deleteUser,
};
