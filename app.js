const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require("body-parser");

app.use(bodyParser.json())
app.use(express.static(path.join(__dirname, 'public')));


const channelRoutes = require("./routes/channel");

app.use("/channel", channelRoutes);

module.exports = app;