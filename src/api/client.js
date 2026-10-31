class ApiClient {
  constructor(request, baseUrl) {
    this.request = request;
    this.baseUrl = baseUrl.replace(/\/$/, '');
  }

  async send({ method, path, data, headers = {} }) {
    const response = await this.request.fetch(`${this.baseUrl}${path}`, {
      method,
      data,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      }
    });

    const text = await response.text();
    let json;

    try {
      json = text ? JSON.parse(text) : null;
    } catch {
      json = null;
    }

    return {
      status: response.status(),
      headers: response.headers(),
      body: text,
      json,
      ok: response.ok()
    };
  }
}

function createApiClient(request, baseUrl) {
  return new ApiClient(request, baseUrl);
}

module.exports = { ApiClient, createApiClient };
