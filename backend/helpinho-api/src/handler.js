const express = require("express");
const serverless = require("serverless-http");
const app = express();

const userController = require("./controllers/userController");
const helpinhoController = require("./controllers/helpinhoController");

app.use(express.json());

// Rotas de Users
app.get("/users/findByEmail/:email", userController.findByEmail);
app.post("/users/signIn", userController.signIn);
app.delete("/users/:userId", userController.deleteUser);
app.post("/users/save", userController.saveUser);
app.get("/users/findById/:userId", userController.findById);
app.get(
  "/users/updateUserHelpinhosCreated/:userId",
  userController.updateUserHelpinhosCreated
);

// Rotas de Helpinhos
app.get("/helpinho/:helpinhoId", helpinhoController.findById);
app.get("/helpinho/findAllByUser/:userId", helpinhoController.findAllByUser);
app.post("/helpinho/search", helpinhoController.searchHelpinhos);
app.post("/helpinho/save", helpinhoController.saveHelpinho);
app.delete("/helpinho/:helpinhoId", helpinhoController.deleteHelpinho);
app.post("/helpinho/donate", helpinhoController.donate);

module.exports.handler = serverless(app);
