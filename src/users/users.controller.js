import {
  createUser,
  findUserByEmail,
  listUsers,
  getUserById,
  deleteUser,
  updateUser,
  countUsers,
  updateUserPassword,
  createManyUsers,
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
    const { password, ...userWithoutPassword } = user;
    return res.status(201).json(userWithoutPassword);
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
    const { password, ...userWithoutPassword } = user;
    return res.status(200).json(userWithoutPassword);
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
    // check if id exists
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "Missing user ID" });
    }
    // verify if users exists
    const user = await getUserById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (
      !req.body.email &&
      !req.body.password &&
      !req.body.name &&
      Object.keys(req.body).length === 0
    ) {
      return res.status(400).json({
        error: "Validation error",
        fields: {
          body: "Provide at least one field to update",
        },
      });
    }
    //validate user Data
    const result = validateUpdateUser(req.body);
    if (!result.ok) {
      return res.status(400).json({
        message: "validation failed",
        errors: result.errors,
      });
    }
    if (result.data.email) {
      const normalizedEmail = result.data.email.toLowerCase().trim();
      const existingUser = await findUserByEmail(normalizedEmail);

      console.log("=== DEBUG EMAIL DOUBLON ===");
      console.log("ID actuel:", id);
      console.log("Email recherché:", normalizedEmail);
      console.log("Utilisateur trouvé:", existingUser);
      console.log("Comparaison IDs:", existingUser?.id, "!==", id);
      console.log("Résultat:", existingUser?.id !== id);

      if (existingUser && existingUser.id !== id) {
        return res.status(409).json({ error: "Email already in use" });
      }
    }
    const updatedUser = await updateUser(id, result.data);
    return res.status(200).json(updatedUser);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

export async function handleSearchUserByEmail(req, res) {
  try {
    const { email } = req.query;
    if (!email) {
      return res
        .status(400)
        .json({ error: "Email query parameter is required" });
    }
    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const { password, ...userWithoutPassword } = user;
    return res.status(200).json(userWithoutPassword);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

export async function handleCountUsers(req, res) {
  try {
    const count = await countUsers();
    return res.status(200).json({ "Users count": count });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

export async function handleUpdatePassword(req, res) {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "Missing user ID" });
    }
    const user = await getUserById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const { password } = req.body;
    if (!password) {
      return res.status(400).json({ message: "Password is required" });
    }
    if (password.length < 8) {
      return res.status(400).json({
        message: "Password must be at least 8 characters",
      });
    }
    const updatedUser = await updateUserPassword(id, password);
    const { password: _, ...userWithoutPassword } = updatedUser;
    return res.status(200).json(userWithoutPassword);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

export async function handleCreateManyUsers(req, res) {
  try {
    const { users } = req.body;
    if (!users || !Array.isArray(users) || users.length === 0) {
      return res.status(400).json({
        error: "Validation error",
        message: "Provide an array of users",
      });
    }
    const validationErrors = [];
    for (let i = 0; i < users.length; i++) {
      const result = validateUser(users[i]);
      if (!result.ok) {
        validationErrors.push({
          index: i,
          user: users[i],
          errors: result.errors,
        });
      }
    }
    if (validationErrors.length > 0) {
      return res.status(400).json({
        error: "Validation error",
        details: validationErrors,
      });
    }
    const emails = users.map((u) => u.email.toLowerCase().trim());
    const duplicatesInList = emails.filter(
      (email, index) => emails.indexOf(email) !== index,
    );
    if (duplicatesInList.length > 0) {
      return res.status(400).json({
        error: "Validation error",
        message: "Duplicate emails in the request",
        duplicates: [...new Set(duplicatesInList)],
      });
    }
    const existingUsersPromises = emails.map((email) => findUserByEmail(email));
    const existingUsers = await Promise.all(existingUsersPromises);
    const existingEmails = existingUsers
      .filter((user) => user !== null)
      .map((user) => user.email);
    if (existingEmails.length > 0) {
      return res.status(409).json({
        error: "Email already exists",
        emails: existingEmails,
      });
    }
    const createdUsers = await createManyUsers(users);
    return res.status(201).json(createdUsers);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
