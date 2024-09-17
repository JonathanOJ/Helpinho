const userModel = require("../models/userModel");

// Find User by Email
const findByEmail = async (req, res) => {
  const { email } = req.params;
  try {
    const result = await userModel.findByEmail(email);
    if (result.Items.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json(result.Items[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not find user" });
  }
};

const findById = async (req, res) => {
  const { userId } = req.params;
  try {
    const result = await userModel.findById(userId);
    if (result) {
      return res.status(200).json(result);
    } else {
      return res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not fetch user" });
  }
};

// User Sign In
const signIn = async (req, res) => {
  try {
    const result = await userModel.signIn(req.body);

    if (!result) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not sign in" });
  }
};

// Save or Update User
const saveUser = async (req, res) => {
  const { userId } = req.body;

  if (userId) {
    try {
      const result = await userModel.updateUser(req.body);
      res.status(200).json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Could not update user" });
    }
  } else {
    try {
      const result = await userModel.createUser(req.body);
      res.status(201).json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Could not create user" });
    }
  }
};

// Update User Helpinhos Created
const updateUserHelpinhosCreated = async (req, res) => {
  const { userId } = req.params;

  try {
    const result = await userModel.updateUserHelpinhosCreated(userId);
    res.status(200).json(result.Attributes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not update user" });
  }
};

// Delete User
const deleteUser = async (req, res) => {
  const { userId } = req.params;
  try {
    const result = await userModel.deleteUser(userId);
    if (result.Attributes) {
      res.status(200).json({ success: true });
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not delete user" });
  }
};

module.exports = {
  updateUserHelpinhosCreated,
  findByEmail,
  findById,
  saveUser,
  signIn,
  deleteUser,
};
