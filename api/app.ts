import express from "express";
import * as bodyParser from "body-parser";
import { errorMiddleware } from "./middlewares/error";
export class App {
  app: express.Application;

  constructor(
    private readonly controllers: unknown,
    private readonly port: number,
  ) {
    this.app = express();
    this.initMiddlewares();
    this.initControllers(this.controllers);
    this.intializeErrorHandling();
  }

  private initMiddlewares() {
    this.app.use(bodyParser.json());
  }

  private intializeErrorHandling() {
    this.app.use(errorMiddleware);
  }

  private initControllers(controllers: any) {
    for (const controller of controllers) {
      this.app.use("/", controller.router);
    }
  }

  public listen() {
    this.app.listen(this.port, () => {
      console.log(`Server running on https://localhost:${this.port}`);
    });
  }
}
