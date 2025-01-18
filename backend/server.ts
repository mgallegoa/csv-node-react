import express, { Express, Request, Response } from "express";
import cors from "cors";

const app: Express = express();
app.use(cors());

const port = process.env.PORT ?? 3000;

app.get("/", (req: Request, res: Response) => {
  res.end("Hi from server and Typescript");
});

app.listen(port, () => {
  console.log("Server running in port ", port);
});
