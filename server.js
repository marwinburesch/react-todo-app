import express from "express";
import { readFile, writeFile } from "fs/promises";
import { v4 as uuid } from "uuid";

const app = express();
const port = 1337;

app.use(express.json());

app.get("/", (request, response) => {
	response.send("Hello World!");
});

app.get("/api/todos", (request, response) => {
	readFile("./database/database.json", "utf8")
		.then(data => JSON.parse(data))
		.then(json => {
			response.json(json.todos);
		});
});

app.get("/api/todos", (request, response) => {
	readFile("./database/database.json", "utf8").then(data => {
		const json = JSON.parse(data);
		response.json(json.todos);
	});
});

app.get("/api/todos", async (request, response) => {
	const data = await readFile("./database/database.json", "utf8");
	const json = JSON.parse(data);
	response.json(json.todos);
});
const DATABASE_URI = "./database/database.json";
app.post("/api/todos", async (request, response) => {
	const data = await readFile(DATABASE_URI, "utf8");
	const json = JSON.parse(data);

	const todo = {
		...request.body,
		id: uuid(),
	};

	json.todos.push(todo);
	await writeFile(DATABASE_URI, JSON.stringify(json));
	response.status(201);
	response.json(todo);
});

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`);
});