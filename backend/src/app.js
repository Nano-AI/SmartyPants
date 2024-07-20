"use strict";
const express = require("express");
const dotenv = require("dotenv");
const app = express();
const port = process.env.PORT;
app.get('/', (req, res) => {
    res.send("Express server");
});
app.listen(port, () => {
    console.log("Server running @ " + port);
});
