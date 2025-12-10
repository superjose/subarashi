export type RequestInput = {
  method: string;
  headers?: Headers;
  url: string;
  body?: BodyInit;
};

export class HttpClient {
  constructor(private readonly baseUrl: string) {}

  private request(input: RequestInput) {
    return fetch(`${this.baseUrl}/${input.url}`, {
      body: input.body,
      method: input.method,
    });
  }

  get(url: string) {
    return this.request({
      method: "GET",
      url,
    });
  }
}
