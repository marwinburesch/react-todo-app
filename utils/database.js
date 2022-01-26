import { MongoClient } from "mongodb";

let client;

export async function connectDatabase(url) {
	client = new MongoClient(url);
	await client.connect();
}

export function getCollection(name) {
	return client.db().collection(name);
}

export function getCredentialCollection() {
	return getCollection("credentials");
}
