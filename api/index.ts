import "dotenv/config";
import { App } from "./app";
import { EmbeddingController } from "./controllers/embed.controller";
import { DomainController } from "./controllers/domain.controller";
import { DocmentTypeController } from "./controllers/document-type.controller";

const port: number = Number(process.env.PORT) || 3000;
const app = new App(
  [
    new EmbeddingController(),
    new DomainController(),
    new DocmentTypeController(),
  ],
  port,
);
app.listen();
