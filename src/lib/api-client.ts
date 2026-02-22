import { clearAuthData, getAccessToken } from "@/lib/auth";
import { getEnvConfig } from "@/lib/env";

export class ApiError extends Error {
  public readonly status: number;

  public constructor(status: number, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

interface ApiRequestOptions extends Omit<RequestInit, "body" | "method"> {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
  skipAuth?: boolean;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginUser {
  id?: string;
  email?: string;
  emailVerified?: boolean;
  smsNumber?: string;
  smsVerified?: boolean;
  firstName?: string;
  lastName?: string;
  [key: string]: unknown;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn?: number;
  user?: LoginUser;
}

export interface RegisterPayload {
  email: string;
  password: string;
  confirmPassword: string;
}

export interface RegisterResponse {
  success: boolean;
  message: string;
}

export interface HealthResponse {
  status?: string;
  message?: string;
  timestamp?: string;
  [key: string]: unknown;
}

const MOCK_DELAY_MS = 500;
const LOGIN_ENDPOINT = "/api/v1/common/auth/login";
const REGISTER_ENDPOINT = "/api/v1/common/auth/register";
const HEALTH_ENDPOINT = "/health";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function getStringField(
  objectValue: Record<string, unknown>,
  fieldName: string,
): string | undefined {
  const fieldValue = objectValue[fieldName];
  return typeof fieldValue === "string" && fieldValue.trim()
    ? fieldValue
    : undefined;
}

function getNumberField(
  objectValue: Record<string, unknown>,
  fieldName: string,
): number | undefined {
  const fieldValue = objectValue[fieldName];
  return typeof fieldValue === "number" ? fieldValue : undefined;
}

function getBooleanField(
  objectValue: Record<string, unknown>,
  fieldName: string,
): boolean | undefined {
  const fieldValue = objectValue[fieldName];
  return typeof fieldValue === "boolean" ? fieldValue : undefined;
}

function parseLoginUser(userValue: unknown): LoginUser | undefined {
  if (!isRecord(userValue)) {
    return undefined;
  }

  const parsedUser: LoginUser = {};

  const id = getStringField(userValue, "id");
  const email = getStringField(userValue, "email");
  const emailVerified = getBooleanField(userValue, "emailVerified");
  const smsNumber = getStringField(userValue, "smsNumber");
  const smsVerified = getBooleanField(userValue, "smsVerified");
  const firstName = getStringField(userValue, "firstName");
  const lastName = getStringField(userValue, "lastName");

  if (id !== undefined) {
    parsedUser.id = id;
  }
  if (email !== undefined) {
    parsedUser.email = email;
  }
  if (emailVerified !== undefined) {
    parsedUser.emailVerified = emailVerified;
  }
  if (smsNumber !== undefined) {
    parsedUser.smsNumber = smsNumber;
  }
  if (smsVerified !== undefined) {
    parsedUser.smsVerified = smsVerified;
  }
  if (firstName !== undefined) {
    parsedUser.firstName = firstName;
  }
  if (lastName !== undefined) {
    parsedUser.lastName = lastName;
  }

  return Object.keys(parsedUser).length > 0 ? parsedUser : undefined;
}

function normalizeLoginResponse(payload: unknown): LoginResponse {
  if (!isRecord(payload)) {
    throw new ApiError(500, "Login response format is not recognized.");
  }

  const nestedData = isRecord(payload.data) ? payload.data : payload;
  const accessToken = getStringField(nestedData, "accessToken");
  const refreshToken = getStringField(nestedData, "refreshToken");

  if (!accessToken || !refreshToken) {
    throw new ApiError(500, "Login response does not include auth tokens.");
  }

  const normalizedResponse: LoginResponse = {
    accessToken,
    refreshToken,
  };

  const expiresIn = getNumberField(nestedData, "expiresIn");
  const user = parseLoginUser(nestedData.user);

  if (expiresIn !== undefined) {
    normalizedResponse.expiresIn = expiresIn;
  }

  if (user !== undefined) {
    normalizedResponse.user = user;
  }

  return normalizedResponse;
}

function shouldUseMockApi(): boolean {
  const { API_BASE_URL } = getEnvConfig();
  return !API_BASE_URL || API_BASE_URL === "__MOCK__";
}

function normalizePath(path: string): string {
  if (/^https?:\/\//i.test(path)) {
    return new URL(path).pathname;
  }

  return path.startsWith("/") ? path : `/${path}`;
}

function resolveApiUrl(path: string): string {
  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  const normalizedPath = normalizePath(path);
  const { API_BASE_URL } = getEnvConfig();
  const sanitizedBaseUrl = API_BASE_URL.endsWith("/")
    ? API_BASE_URL.slice(0, -1)
    : API_BASE_URL;

  return `${sanitizedBaseUrl}${normalizedPath}`;
}

async function parseResponseBody(response: Response): Promise<unknown> {
  const contentType = response.headers.get("content-type") ?? "";

  if (contentType.includes("application/json")) {
    return response.json();
  }

  const textBody = await response.text();

  if (!textBody) {
    return null;
  }

  return { message: textBody };
}

function extractErrorMessage(status: number, payload: unknown): string {
  if (payload && typeof payload === "object" && "message" in payload) {
    const maybeMessage = (payload as { message?: unknown }).message;

    if (typeof maybeMessage === "string" && maybeMessage.trim()) {
      return maybeMessage;
    }
  }

  const fallbackMessages: Record<number, string> = {
    401: "Unauthorized request. Please login again.",
    403: "Forbidden request.",
    404: "Requested resource not found.",
    500: "Server error. Please try again later.",
  };

  return fallbackMessages[status] ?? "Unexpected API error occurred.";
}

function createRequestInit(options: ApiRequestOptions): RequestInit {
  const { body, method = "GET", skipAuth: _skipAuth, ...restOptions } = options;
  const headers = new Headers(restOptions.headers);

  if (!options.skipAuth) {
    const accessToken = getAccessToken();
    if (accessToken) {
      headers.set("Authorization", `Bearer ${accessToken}`);
    }
  }

  const hasBody = body !== undefined;
  if (hasBody && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const requestInit: RequestInit = {
    ...restOptions,
    method,
    headers,
  };

  if (hasBody) {
    requestInit.body = typeof body === "string" ? body : JSON.stringify(body);
  }

  return requestInit;
}

function parseMockBody(body: unknown): Record<string, unknown> {
  if (!body) {
    return {};
  }

  if (typeof body === "string") {
    try {
      return JSON.parse(body) as Record<string, unknown>;
    } catch {
      return {};
    }
  }

  if (typeof body === "object") {
    return body as Record<string, unknown>;
  }

  return {};
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

async function mockApiRequest<T>(
  path: string,
  options: ApiRequestOptions = {},
): Promise<T> {
  await delay(MOCK_DELAY_MS);

  const method = options.method ?? "GET";
  const normalizedPath = normalizePath(path);

  if (method === "POST" && normalizedPath === LOGIN_ENDPOINT) {
    const body = parseMockBody(options.body);
    const email = typeof body.email === "string" ? body.email : "";
    const password = typeof body.password === "string" ? body.password : "";

    if (!email || !password || email === "fail@example.com") {
      throw new ApiError(
        401,
        "Invalid credentials. Use any valid email except fail@example.com.",
      );
    }

    return {
      success: true,
      statusCode: 200,
      data: {
        accessToken: "mock-access-token",
        refreshToken: "mock-refresh-token",
        expiresIn: 28800,
        user: {
          id: "550e8400-e29b-41d4-a716-446655440000",
          email,
          emailVerified: true,
          smsNumber: "+905551234567",
          smsVerified: false,
          firstName: "John",
          lastName: "Doe",
        },
      },
      message: "Success",
      timestamp: new Date().toISOString(),
      path: LOGIN_ENDPOINT,
      responseTime: MOCK_DELAY_MS,
    } as T;
  }

  if (method === "POST" && normalizedPath === REGISTER_ENDPOINT) {
    return {
      success: true,
      message: "Mock registration successful.",
    } as T;
  }

  if (method === "GET" && normalizedPath === HEALTH_ENDPOINT) {
    const now = new Date().toISOString();

    return {
      status: "ok",
      message: "Mock health check passed.",
      timestamp: now,
    } as T;
  }

  throw new ApiError(
    404,
    `Mock endpoint not found: ${method} ${normalizedPath}`,
  );
}

export async function apiRequest<T>(
  path: string,
  options: ApiRequestOptions = {},
): Promise<T> {
  if (shouldUseMockApi()) {
    return mockApiRequest<T>(path, options);
  }

  let response: Response;

  try {
    response = await fetch(resolveApiUrl(path), createRequestInit(options));
  } catch {
    throw new ApiError(
      0,
      "Network request failed. Check connectivity and try again.",
    );
  }

  if (response.status === 204) {
    return undefined as T;
  }

  const payload = await parseResponseBody(response);

  if (!response.ok) {
    if (response.status === 401) {
      clearAuthData();
    }

    throw new ApiError(
      response.status,
      extractErrorMessage(response.status, payload),
    );
  }

  return payload as T;
}

export function login(payload: LoginPayload): Promise<LoginResponse> {
  return apiRequest<unknown>(LOGIN_ENDPOINT, {
    method: "POST",
    body: payload,
    skipAuth: true,
  }).then(normalizeLoginResponse);
}

export function register(payload: RegisterPayload): Promise<RegisterResponse> {
  return apiRequest<RegisterResponse>(REGISTER_ENDPOINT, {
    method: "POST",
    body: payload,
    skipAuth: true,
  });
}

export function getHealth(): Promise<HealthResponse> {
  return apiRequest<HealthResponse>(HEALTH_ENDPOINT, {
    method: "GET",
    skipAuth: true,
  });
}
