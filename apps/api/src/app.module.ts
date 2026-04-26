import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { join } from "path";
import { AppController } from "./app.controller";
import { validateEnv } from "./config/env.schema";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      envFilePath: [
        join(process.cwd(), ".env"),
        join(process.cwd(), "../../.env"),
      ],
      validate: validateEnv,
    }),
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
