import dotenv from "dotenv";
import { server } from "./config/server";

dotenv.config();
const port = process.env.PORT;

server.listen(port, () => {
  console.warn(`the server is online in port ${port}`);
});
