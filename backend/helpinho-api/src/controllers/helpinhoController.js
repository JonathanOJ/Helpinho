const helpinhoModel = require("../models/helpinhoModel");
const userModel = require("../models/userModel");

const searchHelpinhos = async (request, response) => {
  try {
    const helpinhos = await helpinhoModel.searchHelpinho(request.body);
    return response.status(200).json(helpinhos);
  } catch (error) {
    return response.status(500).json({ message: "Internal Server Error" });
  }
};

const findById = async (request, response) => {
  const { id } = request.params;

  try {
    const helpinho = await helpinhoModel.findById(id);

    if (!helpinho) {
      return response.status(404).json({ message: "Helpinho not found" });
    }

    return response.status(200).json(helpinho);
  } catch (error) {
    return response.status(500).json({ message: "Internal Server Error" });
  }
};

const findAllByUser = async (request, response) => {
  const { id } = request.params;

  try {
    const helpinhos = await helpinhoModel.findAllByUser(id);

    return response.status(200).json(helpinhos);
  } catch (error) {
    return response.status(500).json({ message: "Internal Server Error" });
  }
};

const sanitizeHelpinho = (body) => {
  return {
    id: body.id,
    title: body.title,
    description: body.description,
    image: body.image,
    category: body.category,
    users_donated: body.users_donated,
    value: body.value,
    request_emergency: body.request_emergency,
    emergency: body.emergency,
    user_responsable: body.user_responsable,
    created_at: body.created_at,
  };
};

const saveHelpinho = async (request, response) => {
  try {
    const sanitizedBody = sanitizeHelpinho(request.body);
    if (sanitizedBody.id) {
      await helpinhoModel.updateHelpinho(sanitizedBody);
      return response
        .status(200)
        .json({ message: "Helpinho updated successfully" });
    } else {
      const createdHelpinho = await helpinhoModel.createHelpinho(sanitizedBody);
      return response.status(201).json(createdHelpinho);
    }
  } catch (error) {
    console.error(error); // Adiciona logging do erro para depuração
    return response.status(500).json({ message: "Internal Server Error" });
  }
};

const deleteHelpinho = async (request, response) => {
  const { id } = request.params;

  try {
    const deletedCount = await helpinhoModel.deleteHelpinho(id);

    if (deletedCount === 0) {
      return response.status(404).json({ message: "Helpinho not found" });
    }

    return response
      .status(200)
      .json({ message: "Helpinho deleted successfully" });
  } catch (error) {
    return response.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  searchHelpinhos,
  findById,
  findAllByUser,
  saveHelpinho,
  deleteHelpinho,
};
