import express from "express";
import cors from "cors";
import morgan from "morgan";

import { cors as CORS } from "./cors";
import { router } from "../routers";

const server = express();

server.use(express.json());
server.use(express.urlencoded({ extended: true }));
server.use(cors(CORS));
server.use(morgan("dev"));
server.use("/", router);

export { server };
