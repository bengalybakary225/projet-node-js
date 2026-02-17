import { getUsers } from "./users.service.js";
import { Json } from "../utils/responses.js";

export function listUsers(request, response) {
  if (request.method !== "GET") {
    return Json(response, 405, {
      message: "Method not allowed",
    });
  }

  const users = getUsers();
  return Json(response, 200, { data: users });
}
