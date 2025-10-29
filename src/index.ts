import dotenv from "dotenv";
dotenv.config();

import { App } from "./app";

const server = new App();
server.listen();