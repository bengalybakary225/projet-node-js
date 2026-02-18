import { createUser, findUserByEmail } from "./users.service.js";
import { validateUser } from "./users.validation.js";

export async function handleCreateUser(req, res) {
  try {
    //validate user Data
    const result = validateUser(req.body);
    if (!result.ok) {
      return res.status(400).json({
        message: "validation failed",
        errors: result.errors,
      });
    }

    //check if user already exists
    const existingUser = await findUserByEmail(req.body.email);
    if (existingUser) {
      return res.status(409).json({ message: "user already exists" });
    }

    // create user
    const user = await createUser(req.body);
    return res.status(201).json(user);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
