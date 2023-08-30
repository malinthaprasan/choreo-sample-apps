import express from "express";
import cache from "./cache.mjs";
import { v4 as uuidv4 } from "uuid";
import bodyParser from 'body-parser';

const app = express();
app.use(bodyParser.json({limit: "50mb"}));
app.use(bodyParser.urlencoded({limit: "50mb", extended: true, parameterLimit:50000}));

// add a book - request body should contain a title, status and an author
app.post("/reading-list/payload-size", (req, res) => {
  const payloadSize = JSON.stringify(req.body).length;
  res.json({ payloadSize: payloadSize });
});

// health check
app.get("/reading-list/payload-size", (_, res) => {
  return res.sendStatus(200);
});

app.use((err, _req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }
  console.error(err);
  res.status(500);
  res.json({ error: err.message });
});

app.use("*", (_, res) => {
  return res
    .status(404)
    .json({ error: "the requested resource does not exist on this server" });
});

export default app;
