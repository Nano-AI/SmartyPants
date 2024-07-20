import express, { Request, Response } from "express";
import dotenv from "dotenv";

// configures dotenv to work in your application
dotenv.config();
const app = express();

const PORT = process.env.PORT;

app.get("/", (request: Request, response: Response) => {
    response.status(200).send("Hello World");
});

app.get("/search/:query", (req: Request, response: Response) => {
    // TODO: send results
    response.status(200).send();
});

app.get("/get/:id", (req: Request, response: Response) => {
    // TODO: get specific results
});

app.listen(PORT, () => {
    console.log("Server running at PORT: ", PORT);
}).on("error", (error) => {
    // gracefully handle error
    throw new Error(error.message);
});
