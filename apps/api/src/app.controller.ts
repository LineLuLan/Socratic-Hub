import { Controller, Get } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import type { Env } from "./config/env.schema";

@Controller()
export class AppController {
  constructor(private readonly config: ConfigService<Env, true>) {}

  @Get("health")
  health() {
    const dbUrl = this.config.get("DATABASE_URL", { infer: true });
    return {
      status: "ok",
      service: "socratic-hub-api",
      env: this.config.get("NODE_ENV", { infer: true }),
      databaseConfigured: Boolean(dbUrl),
      timestamp: new Date().toISOString(),
    };
  }
}
