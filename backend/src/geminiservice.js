/*
* geminiservice.js - Berkan Mertan (Pratham Team 10)
* A wrapper module that simplifies the Gemini API's usage and reduces code redundancy for our backend
*/

// Initialize Gemini API with env key
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_KEY);
var model;
const fs = require("fs");

let GEMINIPREPARED = false;

// Reduce redundancy with a better query function
async function queryGem(prompt) {
  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();
  return text;
}

// Run a demonstrational query to the Gemini API
async function runDemo() {
  const prompt = "What is 10 times 10?";
  return await queryGem(prompt);
}

// Set up the Gemini environment to be able to handle future requests CORRECTLY. This is the INSTRUCTOR
// function, meant to give the bot preliminary instructions as to what to do with future data.
async function prepareGeminiInstruction() {
  const instructionSet = JSON.parse(await fs.readFileSync("./instructions.json"));
  console.log(`Instruction set from JSON: ${JSON.stringify(instructionSet)}`);

  const instructions = instructionSet["setup"];

  model = genAI.getGenerativeModel({ 
    model: "gemini-1.5-flash",
    systemInstruction: instructions
  });

  return await queryGem(instructions);
}

// Parse out keywords
module.exports = {
    runDemo,
    prepareGeminiInstruction,
    queryGem,
    GEMINIPREPARED
};
