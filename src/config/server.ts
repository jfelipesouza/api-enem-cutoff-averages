import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";

import { cors as CORS } from "./cors";
import { router as ROUTER } from "../routers";

const server = express();
dotenv.config();

server.use(express.json());
server.use(express.urlencoded({ extended: true }));
server.use(cors(CORS));
server.use(morgan("dev"));
server.use("/", ROUTER);

export { server };
