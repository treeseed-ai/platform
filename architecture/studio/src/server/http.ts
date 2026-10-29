import {
  createServer,
  type IncomingMessage,
  type ServerResponse,
  type Server,
} from "node:http";
import { randomBytes } from "node:crypto";
import { readFileSync, existsSync } from "node:fs";
import { resolve, extname } from "node:path";
import { Context } from "cordis";
import { StudioApi } from "./api.js";

export class StudioHttpPlugin {
  static readonly inject = ["studio"];
  private server: Server;
  private token = randomBytes(32).toString("hex");
  private api: StudioApi;
  private origin = "";
  constructor(
    context: Context,
    private options: { port: number; client: string },
  ) {
    this.api = new StudioApi(context.studio);
    this.server = createServer(this.request.bind(this));
    context.effect(this.listen.bind(this));
  }
  private listen(): () => void {
    this.server.listen(this.options.port, "127.0.0.1", this.ready.bind(this));
    return this.close.bind(this);
  }
  private close(): void {
    this.server.close();
  }
  private ready(): void {
    const address = this.server.address();
    if (!address || typeof address === "string") return;
    this.origin = "http://127.0.0.1:" + address.port;
    process.stdout.write("STUDIO_URL=" + this.origin + "\n");
  }
  private async request(
    request: IncomingMessage,
    response: ServerResponse,
  ): Promise<void> {
    try {
      if (request.headers.host !== new URL(this.origin).host)
        throw new Error("HOST_REJECTED");
      const path = new URL(request.url || "/", this.origin).pathname;
      if (path === "/api/session" && request.method === "GET")
        return this.json(response, { token: this.token });
      if (path.startsWith("/api/"))
        return await this.operation(request, response, path.slice(5));
      this.staticFile(path, response);
    } catch (error) {
      this.json(
        response,
        { error: String(error).replace(/^Error: /, "") },
        String(error).includes("CONFLICT") ? 409 : 400,
      );
    }
  }
  private async operation(
    request: IncomingMessage,
    response: ServerResponse,
    operation: string,
  ): Promise<void> {
    if (
      request.method !== "POST" ||
      request.headers["x-studio-token"] !== this.token ||
      (request.headers.origin && request.headers.origin !== this.origin)
    )
      throw new Error("SESSION_REJECTED");
    const chunks = [];
    let size = 0;
    for await (const chunk of request) {
      size += chunk.length;
      if (size > 32 * 1024 * 1024) throw new Error("REQUEST_TOO_LARGE");
      chunks.push(chunk);
    }
    const body = JSON.parse(Buffer.concat(chunks).toString() || "{}");
    this.json(response, await this.api.handle(operation, body));
  }
  private staticFile(path: string, response: ServerResponse): void {
    const target = resolve(
      this.options.client,
      "." + decodeURIComponent(path === "/" ? "/index.html" : path),
    );
    if (
      !target.startsWith(resolve(this.options.client) + "/") ||
      !existsSync(target)
    ) {
      response.writeHead(404);
      response.end("Not found");
      return;
    }
    this.fileHeaders(target, response);
    response.end(readFileSync(target));
  }
  private fileHeaders(target: string, response: ServerResponse): void {
    const types: Record<string, string> = {
      ".html": "text/html",
      ".js": "text/javascript",
      ".css": "text/css",
      ".json": "application/json",
      ".svg": "image/svg+xml",
      ".woff2": "font/woff2",
    };
    response.writeHead(200, {
      "content-type": types[extname(target)] || "application/octet-stream",
      "x-content-type-options": "nosniff",
      "cache-control": "no-store",
    });
  }
  private json(response: ServerResponse, value: unknown, status = 200): void {
    response.writeHead(status, {
      "content-type": "application/json",
      "cache-control": "no-store",
      "x-content-type-options": "nosniff",
    });
    response.end(JSON.stringify(value));
  }
}
