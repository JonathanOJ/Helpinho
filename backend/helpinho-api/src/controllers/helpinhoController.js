const helpinhoModel = require("../models/helpinhoModel");
const userModel = require("../models/userModel");

const findById = async (req, res) => {
  try {
    const result = await helpinhoModel.findById(req.params.helpinhoId);
    if (result) {
      return res.status(200).json(result);
    } else {
      return res.status(404).json({ error: "Helpinho not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not fetch helpinho" });
  }
};

// Find All Helpinhos by User ID
const findAllByUser = async (req, res) => {
  const { userId } = req.params;

  try {
    const result = await helpinhoModel.findAllByUser(userId);
    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not fetch helpinhos by user" });
  }
};

// Search Helpinhos
const searchHelpinhos = async (req, res) => {
  try {
    const result = await helpinhoModel.searchHelpinho(req.body);
    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not perform search" });
  }
};

// Create or Update Helpinho
const saveHelpinho = async (req, res) => {
  try {
    let result;
    if (req.body.helpinhoId != "") {
      result = await helpinhoModel.updateHelpinho(req.body);
    } else {
      result = await helpinhoModel.createHelpinho(req.body);

      if (result.helpinhoId) {
        await userModel.updateUserHelpinhosCreated(
          req.body.user_responsable.userId
        );
      }
    }
    res.status(200).json(result.Attributes);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while processing the request" });
  }
};

// Delete Helpinho
const deleteHelpinho = async (req, res) => {
  const { helpinhoId } = req.params;
  const helpinho = await helpinhoModel.findById(helpinhoId);

  if (helpinho.value_donated > 0) {
    return res.status(400).json({ error: "Helpinho contêm doações!" });
  }

  try {
    const result = await helpinhoModel.deleteHelpinho(helpinhoId);
    res.status(200).json({ success: result.Attributes ? true : false });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not delete helpinho" });
  }
};

// Donate
const donate = async (req, res) => {
  try {
    const result = await helpinhoModel.donate(req.body);

    if (result) {
      const userAlreadyDonated = result.users_donated.filter(
        (user) => user.userId === req.body.userId
      );

      if (userAlreadyDonated.length === 1) {
        await userModel.updateTotalHelpinhosDonated(req.body);
      }

      await userModel.updateTotalDonated(req.body);
    }

    res.status(200).json(result.Attributes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not donate" });
  }
};

module.exports = {
  searchHelpinhos,
  findById,
  findAllByUser,
  saveHelpinho,
  deleteHelpinho,
  donate,
};
