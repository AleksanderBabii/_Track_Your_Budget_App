import { api } from "./axios";

import type {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
} from "../types/auth";

// Auth endpoints return JWT plus normalized user profile payload.
export async function login(data: LoginRequest): Promise<AuthResponse> {
  const response = await api.post<AuthResponse>("/auth/login", data);
  return response.data;
}

// Registration has the same response shape as login to bootstrap session immediately.
export async function register(data: RegisterRequest): Promise<AuthResponse> {
  const response = await api.post<AuthResponse>("/auth/register", data);
  return response.data;
}
