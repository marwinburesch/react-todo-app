import cors from "cors";
import express from "express";

import dotenv from "dotenv";
dotenv.config();

import { readFile, writeFile } from "fs/promises";
import { v4 as uuid } from "uuid";

const app = express();
const port = 1337;

app.use(express.json());
app.use(cors());

app.get("/", (request, response) => {
	response.send("Hello World!");
});

const DATABASE_URI = "./database/database.json";

app.get("/api/todos", async (request, response) => {
	const data = await readFile(DATABASE_URI, "utf8");
	const json = JSON.parse(data);
	response.json(json.todos);
});

app.post("/api/todos", async (request, response) => {
	const data = await readFile(DATABASE_URI, "utf8");
	const json = JSON.parse(data);

	const todo = {
		...request.body,
		isChecked: false,
		id: uuid(),
	};

	json.todos.push(todo);
	await writeFile(DATABASE_URI, JSON.stringify(json, null, 4));
	response.status(201);
	response.json(todo);
});

app.delete("/api/todos", async (request, response) => {
	const { id } = request.body;
	const data = await readFile(DATABASE_URI, "utf-8");
	const json = JSON.parse(data);
	const index = json.todos.findIndex(user => user.id === id);
	if (index < 0) {
		throw new Error("This entry does not exist");
	}
	json.todos.splice(index, 1);
	await writeFile(DATABASE_URI, JSON.stringify(json, null, 4));
	// Send a 204 (No Content)
	response.status(204);
	response.send();
	// Or 200
	// response.status(200);
	// response.send("entry deleted");
});

app.put("/api/todos", async (request, response) => {
	const { id, update } = request.body;
	const data = await readFile(DATABASE_URI, "utf-8");
	const json = JSON.parse(data);
	const index = json.todos.findIndex(user => user.id === id);
	if (index < 0) {
		throw new Error("This entry does not exist");
	}
	json.todos[index] = { ...json.todos[index], ...update, id };
	await writeFile(DATABASE_URI, JSON.stringify(json, null, 4));
	// Send a 200
	response.status(200);
	response.send(json.todos[index]);
	// Or 204 (No Content)
	// response.status(204);
	// response.send();
});

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`);
});
