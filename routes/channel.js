const express = require("express");
const routes = express.Router();
const channelCtrl = require("../controllers/channel");

routes.get("/", channelCtrl.getEPG);

module.exports = routes;