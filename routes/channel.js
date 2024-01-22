const express = require("express");
const routes = express.Router();
const channelCtrl = require("../controllers/channel");

routes.get("/", channelCtrl.getEPG);
routes.get("/record", channelCtrl.record);

module.exports = routes;