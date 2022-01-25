type clientConfig = {
  body?: any;
  method?: string;
  customConfig?: {
    headers?: any;
  };
};

export async function client<Type>(endpoint: string, providedConfig: clientConfig = {}): Promise<Type> {
  const headers = { "Content-Type": "application/json" };

  const config = {
    method: providedConfig?.body ? "POST" : "GET",
    ...providedConfig,
    headers: {
      ...headers,
      ...providedConfig?.customConfig?.headers,
    },
  };

  if (providedConfig?.body) {
    config.body = JSON.stringify(providedConfig?.body);
  }

  try {
    const response = await window.fetch(endpoint, config);
    if (response.ok) {
      return (await response.json()) as Promise<Type>;
    }

    throw new Error(response.statusText);
  } catch (err: any) {
    console.error("An error occurred", err);
    return Promise.reject(err?.message);
  }
}

client.get = function <T>(endpoint: string, customConfig = {}) {
  return client<T>(endpoint, { ...customConfig, method: "GET" });
};

client.post = async function <T>(endpoint: string, body: any, customConfig = {}) {
  return client<T>(endpoint, { ...customConfig, body });
};
