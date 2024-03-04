import "dotenv/config";
import { App } from "./app";

const port: number = Number(process.env.PORT) || 3000;
const app = new App([], port);
app.listen();
