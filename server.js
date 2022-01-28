import cors from "cors";
import express from "express";

import dotenv from "dotenv";
dotenv.config();

import { readFile, writeFile } from "fs/promises";
import mongoose from "mongoose";
import Todo from "./models/todo.model.js";

if (!process.env.MONGODB_URI) {
	throw new Error("No MONGODB_URI available in dotenv");
}

const app = express();
const port = 1337;

app.use(express.json());
app.use(cors());

app.get("/", (request, response) => {
	response.send("Hello World!");
});

const DATABASE_URI = "./database/database.json";

app.get("/api/todos", async (request, response, next) => {
	try {
		const todos = await Todo.find({});
		response.json(todos);
	} catch (error_) {
		next(error_);
	}
});

app.post("/api/todos", async (request, response, next) => {
	try {
		const todo = new Todo({
			...request.body,
			isChecked: false,
		});

		const mongoDbResponse = await todo.save();

		response.status(201).json(mongoDbResponse);
	} catch (error_) {
		next(error_);
	}
});

app.delete("/api/todos/:id", async (request, response, next) => {
	try {
		const todoId = request.params.id;

		const deletedTodo = await Todo.findByIdAndDelete(todoId);

		if (!deletedTodo) {
			response.status(404);
			response.json({ error: { message: "This entry does not exist" } });
			return;
		}

		response.status(200);
		response.json(deletedTodo);
	} catch (error_) {
		next(error_);
	}
});

app.put("/api/todos/:id", async (request, response, next) => {
	try {
		const todoId = request.params.id;
		const update = request.body;

		const todo = await Todo.findByIdAndUpdate(todoId, update, { returnDocument: "after" });

		if (!todo) {
			response.status(404);
			response.json({ error: { message: "This entry does not exist" } });
			return;
		}

		response.status(200);
		response.json(todo);
	} catch (error_) {
		console.error(error_);

		response.status(500);
		response.json({ error: { message: "INTERNAL_SERVER_ERROR" } });
	}
});

mongoose.connect(process.env.MONGODB_URI).then(() => {
	app.listen(port, () => {
		console.log(`Server listening on port ${port} 🚀`);
	});
});
