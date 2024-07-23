/*
* app.js - Berkan Mertan (Pratham Team 10)
* The entry point of the SmartyPants backend. This code provides the express
* routing service, which takes any user provided data or query and routes
* it to the appropriate local modules involving the database or processing with the LLM.
*/

// Load dependencies
"use strict";
const express = require("express");
const dotenv = require("dotenv");
const fs = require("fs");
var cors = require('cors');

// Config .env for environment variable loading
dotenv.config();

const db = require("./database");
const gemini = require('./geminiservice');
const { error } = require("console");
const app = express();

app.use(cors());
// Setup server port
const port = process.env.PORT;

// Default path
app.get('/', (req, res) => {
    res.send("Server running normally.");
});

// Demo LLM test path
app.get('/testGemini', async (req, res) => {
    res.send(await gemini.runDemo());
});

// The default endpoint for queries made by the user. If they choose not to enter
// tags, flags, and anything else manually, this is where the queries for LLM/Gemini processing will go
app.get('/naturalUserQuery/:query', async (req, res) => {
    if (!gemini.GEMINIPREPARED) {
        res.send("GEMINI LLM NOT PREPARED YET...");
        throw new Error("Gemini LLM interface not prepared for user interaction yet!");
    }
    console.log(`User said: ${req.params.query}`);

    const GeminiResponse = await gemini.queryGem(req.params.query);
    console.log(`SmartyPants computes: ${GeminiResponse}`);
    res.send(GeminiResponse);
});

// This is the secondary endpoint for queries made by the user. If they DO choose to enter
// some custom flags, this is where the data will be sent.
app.post('/parametrizedUserQuery', (req, res) => {

});

// Initialize server at the correct port
app.listen(port, async () => {
    console.log("Server running @ " + port);
    console.log("Affirmative Gemini instruction reception pending...");

    console.log(`RECEIVED: ${await gemini.prepareGeminiInstruction()}`);
    console.log("SmartyPants is ready for extracting information now.");

    gemini.GEMINIPREPARED = true;
});