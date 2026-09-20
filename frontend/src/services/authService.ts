import { api } from "./api";
import type { AuthResponse, AuthUser } from "@/types/auth";

export async function registerRequest(name: string, email: string, password: string): Promise<AuthResponse> {
  const res = await api.post("/auth/register", { name, email, password });
  return res.data.data;
}

export async function loginRequest(email: string, password: string): Promise<AuthResponse> {
  const res = await api.post("/auth/login", { email, password });
  return res.data.data;
}

export async function fetchMe(): Promise<AuthUser> {
  const res = await api.get("/auth/me");
  return res.data.data;
}
