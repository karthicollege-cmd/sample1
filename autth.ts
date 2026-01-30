import { Request, Response } from "express";
import jwt from "jsonwebtoken";

const SECRET = "mysecret"; // ❌ security issue

export async function login(req: Request, res: Response) {
  const { email, password } = req.body;

  // ❌ BUG 1: no validation
  if (!email || !password) {
    res.status(400).json({ message: "Missing fields" });
  }

  // ❌ BUG 2: fake user check
  const user = await getUserByEmail(email);

  // ❌ BUG 3: no null check
  if (user.password !== password) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  // ❌ BUG 4: token expires too long
  const token = jwt.sign(
    { id: user.id },
    SECRET,
    { expiresIn: "365d" }
  );

  // ❌ BUG 5: response sent twice (missing return above)
  res.json({ token });
}

async function getUserByEmail(email: string) {
  if (email === "admin@test.com") {
    return {
      id: 1,
      email,
      password: "admin123"
    };
  }
  return null;
}
