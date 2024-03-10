import "dotenv/config";
import { App } from "./app";
import { EmbeddingController } from "./controllers/embed";
import { DomainController } from "./controllers/domain";
import { DocmentTypeController } from "./controllers/document-type";

const port: number = Number(process.env.PORT) || 3000;
const app = new App([new EmbeddingController(), new DomainController(), new DocmentTypeController()], port);
app.listen();
