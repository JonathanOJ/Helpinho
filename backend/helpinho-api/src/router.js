const express = require("express");

const router = express.Router();

const userController = require("./controllers/userController");
const helpinhoController = require("./controllers/helpinhoController");

router.get("/users/findByEmail/:email", userController.findByEmail);
router.post("/users/signIn", userController.signIn);
router.delete("/users/:id", userController.deleteUser);
router.post("/users/save", userController.saveUser);
router.get(
  "/users/updateUserHelpinhosCreated/:id",
  userController.updateUserHelpinhosCreated
);

router.get("/helpinho/:id", helpinhoController.findById);
router.get("/helpinho/findAllByUser/:id", helpinhoController.findAllByUser);
router.post("/helpinho/search", helpinhoController.searchHelpinhos);
router.post("/helpinho/save", helpinhoController.saveHelpinho);

router.delete("/helpinho/:id", helpinhoController.deleteHelpinho);

module.exports = router;
