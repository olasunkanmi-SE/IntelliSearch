import "dotenv/config";
import { App } from "./app";
import { EmbeddingController } from "./controllers/embed";

const port: number = Number(process.env.PORT) || 3000;
const app = new App([new EmbeddingController()], port);
app.listen();
