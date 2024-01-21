const express = require('express');
const app = express();
const bodyParser = require("body-parser");
app.use(bodyParser.json())

const channelRoutes = require("./routes/channel");

app.use("/channel", channelRoutes);

module.exports = app;