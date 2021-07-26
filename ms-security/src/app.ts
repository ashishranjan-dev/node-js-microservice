import dotenv from "dotenv";
dotenv.config({
    path: "env/.env"
});
import express, { Application } from "express";
import { useExpressServer } from "routing-controllers";
import cors from "cors";
import helmet from "helmet";
import { createConnection, Connection } from "typeorm";
import Logger from "./utils/logger";
import morganMiddleware from "./middlewares/morgan.middleware";

export class App {
    private readonly app: Application = express();
    public db: Connection;
    private readonly dev =
        (process.env.NODE_ENV || "development") === "development";

    private middlewares() {
        this.app.use(cors());
        this.app.use(helmet());
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
        this.app.use(morganMiddleware);
    }

    async databaseConnection(): Promise<Connection> {
        return await createConnection().catch((err) => {
            Logger.error(
                "[Fatal] Failed to establish connection to database! Exiting..."
            );
            Logger.error(JSON.stringify(err));
            process.exit(1);
        });
    }

    public async start(): Promise<Application> {
        this.db = await this.databaseConnection();
        this.middlewares();

        return useExpressServer(this.app, {
            routePrefix: "/api/",
            controllers: [__dirname + "/controllers/*.controller.ts"]
        });
    }

    public async stop(): Promise<void> {
        Logger.info("Application stoped");
    }
}
