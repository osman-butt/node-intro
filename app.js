import express, { request, response } from "express";
import fs from "fs/promises";
import cors from "cors";

const app = express();
const port = 3333;

app.use(express.json()); // Makes JSON data from http request available as request.body
app.use(cors()); // Allows requests from different origins

// Helper function
async function getUsers() {
  const data = await fs.readFile("data.json");
  const users = JSON.parse(data);
  return users;
}

function saveUsers(data) {
  fs.writeFile("data.json", JSON.stringify(data));
}

// ROUTES

app.listen(port, () => {
  console.log(`App is running on "http://localhost:${port}`);
});

app.get("/", (request, response) => {
  response.send("Hello World!");
});

app.get("/test", (request, response) => {
  response.send("TEST!");
});

app.get("/users", async (request, response) => {
  const users = await getUsers();
  response.json(users);
});

app.get("/users/:id", async (request, response) => {
  const id = request.params.id;
  const users = await getUsers();
  const specificUser = users.find(user => user.id === Number(id));
  response.json(specificUser);
});

app.post("/users", async (request, response) => {
  const newUser = request.body;
  newUser.id = new Date().getTime();

  const users = await getUsers();

  users.push(newUser);
  saveUsers(users);
  response.json(users);
});

app.put("/users/:id", async (request, response) => {
  const id = request.params.id;
  //   console.log(id);

  const users = await getUsers();

  const updatedUser = users.find(user => user.id === Number(id));

  updatedUser.name = request.body.name;
  updatedUser.title = request.body.title;
  updatedUser.mail = request.body.mail;
  updatedUser.image = request.body.image;

  saveUsers(users);
  response.json(users);
});

app.delete("/users/:id", async (request, response) => {
  const id = request.params.id;

  const users = await getUsers();

  const newUsers = users.filter(user => user.id !== Number(id));
  console.log(newUsers);

  saveUsers(newUsers);
  response.json(newUsers);
});
