import express from "express";

const app = express();

app.get("/", (req, res) => {
  res.send("users management API");
});

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});

// import http from "node:http";
// import { Json } from "./utils/responses.js";
// import { listUsers } from "./users/users.controllers.js";

// const listener = (request, response) => {
//   if (request.url === "/users") {
//     return listUsers(request, response);
//   }

//   return Json(response, 404, {
//     message: "Not found",
//   });
// };

// const server = http.createServer(listener);
// server.listen(3000);

// console.log("Server running at http://localhost:3000/");

// const listener = (request, response) => {
//   response.writeHead(200, { "Content-Type": "text/plain" });
//   response.end("hello world\n");
// };
