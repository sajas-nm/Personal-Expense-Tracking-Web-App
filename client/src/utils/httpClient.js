function assertPath(path) {
  const type = typeof path;
  if (type !== "string") {
    throw new TypeError(
      `The path should be a string, instead received a ${type}`
    );
  }
}

const BASE_APP_API_URL = process.env.BASE_APP_API_URL
  ? process.env.BASE_APP_API_URL
  : "http://localhost:5000";

async function parseResponse(res) {
  if (res.ok) {
    return res.status !== 204 ? await res.json() : { success: true };
  } else {
    const errorMessage = await res.text();
    return Promise.reject(new Error(errorMessage));
  }
}

export function httpClient(path, options = {}) {
  const {
    headers,
    query = null,
    method = "GET",
    body,
    host = BASE_APP_API_URL,
    ...extraOpts
  } = options;
  assertPath(path);

  // Compose the request configuration object
  const reqOptions = {
    method,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    ...extraOpts,
  };

  // If a body object is passed, automatically stringify it.
  if (body && !["GET", "DELETE"].includes(method)) {
    reqOptions.body = typeof body === "object" ? JSON.stringify(body) : body;
  }

  let queryString = "";
  if (query) {
    // Convert to encoded string and prepend with ?
    queryString = new URLSearchParams(query).toString();
    queryString = queryString && `?${queryString}`;
  }

  return fetch(`${host}${path}${queryString}`, reqOptions).then(parseResponse);
}
