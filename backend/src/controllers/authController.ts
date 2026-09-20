import { Response } from "express";
import bcrypt from "bcryptjs";
import User from "../models/User";
import { signToken } from "../services/tokenService";
import { AuthedRequest } from "../middleware/auth";
import type { Request } from "express";

function publicUser(user: { _id: unknown; name: string; email: string; createdAt: Date }) {
  return { id: user._id, name: user.name, email: user.email, createdAt: user.createdAt };
}

// POST /api/auth/register
export async function register(req: Request, res: Response) {
  try {
    const { name, email, password } = req.body;

    if (!name || !String(name).trim()) {
      return res.status(400).json({ success: false, message: "Name is required" });
    }
    if (!email || !String(email).trim()) {
      return res.status(400).json({ success: false, message: "Email is required" });
    }
    if (!password || String(password).length < 8) {
      return res.status(400).json({ success: false, message: "Password must be at least 8 characters" });
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const existing = await User.findOne({ email: normalizedEmail });
    if (existing) {
      return res.status(409).json({ success: false, message: "An account with this email already exists" });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ name: String(name).trim(), email: normalizedEmail, passwordHash });

    const token = signToken(String(user._id));
    res.status(201).json({ success: true, data: { token, user: publicUser(user) } });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to register", error: String(err) });
  }
}

// POST /api/auth/login
export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password are required" });
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    const matches = await user.comparePassword(password);
    if (!matches) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    const token = signToken(String(user._id));
    res.json({ success: true, data: { token, user: publicUser(user) } });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to log in", error: String(err) });
  }
}

// GET /api/auth/me
export async function me(req: AuthedRequest, res: Response) {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    res.json({ success: true, data: publicUser(user) });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to fetch profile", error: String(err) });
  }
}
