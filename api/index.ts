import "dotenv/config";
import { App } from "./app";
import { ChatController } from "./controllers/chat-controller";
import { DocmentTypeController } from "./controllers/document-type.controller";
import { DomainController } from "./controllers/domain.controller";
import { EmbeddingController } from "./controllers/embed.controller";

const port: number = Number(process.env.PORT) || 3000;
const app = new App(
  [new EmbeddingController(), new DomainController(), new DocmentTypeController(), new ChatController()],
  port
);
app.listen();
