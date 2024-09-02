const express = require("express");
const cors = require("cors");
require("dotenv").config();

const router = require("./router");
const db = require("./dataBase");

const app = express();
app.use(express.json());
app.use(cors());
app.use(router);

module.exports = app;
