import { safeStorage } from "@/lib/storage";

const ACCESS_TOKEN_KEY = "accessToken";
const REFRESH_TOKEN_KEY = "refreshToken";
const USER_EMAIL_KEY = "authUserEmail";

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export function getAccessToken(): string | null {
  return safeStorage.getItem(ACCESS_TOKEN_KEY);
}

export function getRefreshToken(): string | null {
  return safeStorage.getItem(REFRESH_TOKEN_KEY);
}

export function setAuthTokens(tokens: AuthTokens): void {
  safeStorage.setItem(ACCESS_TOKEN_KEY, tokens.accessToken);
  safeStorage.setItem(REFRESH_TOKEN_KEY, tokens.refreshToken);
}

export function clearAuthTokens(): void {
  safeStorage.removeItem(ACCESS_TOKEN_KEY);
  safeStorage.removeItem(REFRESH_TOKEN_KEY);
}

export function hasAccessToken(): boolean {
  return Boolean(getAccessToken());
}

export function setAuthUserEmail(email: string): void {
  safeStorage.setItem(USER_EMAIL_KEY, email);
}

export function getAuthUserEmail(): string | null {
  return safeStorage.getItem(USER_EMAIL_KEY);
}

export function clearAuthUserEmail(): void {
  safeStorage.removeItem(USER_EMAIL_KEY);
}

export function clearAuthData(): void {
  clearAuthTokens();
  clearAuthUserEmail();
}
