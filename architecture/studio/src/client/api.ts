export class ApiClient {
  private token = "";
  async call<T>(operation: string, body: unknown = {}): Promise<T> {
    if (!this.token)
      this.token = (await (await fetch("/api/session")).json()).token;
    const response = await fetch("/api/" + operation, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-studio-token": this.token,
      },
      body: JSON.stringify(body),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Request failed");
    return data as T;
  }
}
