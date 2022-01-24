import { MyHttpError, MyError } from "../errors/errors.js";

export async function client(endpoint, { body, ...customConfig } = {}) {
  const headers = { "Content-Type": "application/json" };

  const config = {
    method: body ? "POST" : "GET",
    ...customConfig,
    headers: {
      ...headers,
      ...customConfig.headers,
    },
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  let data;
  try {
    const response = await window.fetch(endpoint, config);

    try {
      data = await response.json();
    } catch (error) {
      if (error instanceof SyntaxError) {
        throw new MyError("syntax error occured while parsing json response", error.stack);
      }
    }

    if (response.ok) {
      return data;
    }

    throw new Error(response.statusText);
  } catch (err) {
    if (err instanceof TypeError) {
      throw new MyHttpError(err.message ? err.message : data, err.stack);
    }
    throw err;
  }
}

client.get = function (endpoint, customConfig = {}) {
  return client(endpoint, { ...customConfig, method: "GET" });
};

client.post = function (endpoint, body, customConfig = {}) {
  return client(endpoint, { ...customConfig, body });
};

client.update = function (endpoint, body, customConfig = {}) {
  return client(endpoint, { method: "PUT", ...customConfig, body });
};

client.delete = function (endpoint, customConfig = {}) {
  return client(endpoint, { method: "DELETE", ...customConfig });
};
