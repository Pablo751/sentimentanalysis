export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

type RequestInitWithJson = RequestInit & {
  json?: unknown;
};

export async function apiRequest<T>(input: RequestInfo | URL, init: RequestInitWithJson = {}): Promise<T> {
  const { json, headers: initHeaders, ...rest } = init;
  const headers = new Headers(initHeaders);
  if (json !== undefined && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(input, {
    ...rest,
    headers,
    credentials: "include",
    body: json !== undefined ? JSON.stringify(json) : rest.body,
  });

  const contentType = response.headers.get("content-type") || "";
  const payload = contentType.includes("application/json")
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    const message = typeof payload === "object" && payload && "error" in payload && typeof payload.error === "string"
      ? payload.error
      : `Request failed with status ${response.status}.`;

    throw new ApiError(response.status, message);
  }

  return payload as T;
}
