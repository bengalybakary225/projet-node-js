import {
  createUser,
  findUserByEmail,
  listUsers,
  getUserById,
  deleteUser,
  updateUser,
} from "./users.service.js";

import { validateUser, validateUpdateUser } from "./users.validation.js";

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

export async function handlelistUsers(req, res) {
  try {
    const users = await listUsers();
    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
export async function handleGetUserById(req, res) {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "Missing user ID" });
    }
    const user = await getUserById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

export async function handlDeleteUser(req, res) {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "Missing user ID" });
    }
    const user = await getUserById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    await deleteUser(id);
    return res.status(200).json({ message: "user deleted successfully" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

export async function handleUpdateUser(req, res) {
  try {
    // chech if id exists
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "Missing user ID" });
    }

    // verify if users exists
    const user = await getUserById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    //validate user Data
    const result = validateUpdateUser(req.body);
    if (!result.ok) {
      return res.status(400).json({
        message: "validation failed",
        errors: result.errors,
      });
    }
    const updatedUser = await updateUser(id, result.data);
    return res.status(200).json(updatedUser);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
