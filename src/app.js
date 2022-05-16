import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieSession from "cookie-session";
import router from "./routes/index";
import config from "./config";
import db from "./config/database";

dotenv.config();

const app = express();
const port = config.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

db.connect();
app.use(cookieSession({
  maxAge: 24 * 60 * 60 * 1000,
  keys: config.COOKIE_KEY,
}));

app.get("/", (req, res) => {
  res.send("Welcome to Revie Housing inc");
});
app.use("/api/v1", router);

// Global 404 error handler
app.use((req, res, next) => res.status(404).send({
  status: "error",
  error: "Not found",
  message: "This is not the route you're looking for. You messed up",
}));

app.use((err, req, res, next) => {
  if (!err.statusCode || err.statusCode === 500) {
    config.logger.error(`
      Error caught at ${req.path}, 
      Request body: ${JSON.stringify(req.body)},
      Request User: ${JSON.stringify(req.user)},
      Request Params: ${JSON.stringify(req.params)}
      Request Query: ${JSON.stringify(req.query)}
      Error Message: ${JSON.stringify(err.message)}
      Error Logs: ${JSON.stringify(err.stack)}
  }`);
  }
  // const isKnownError = Object.keys(errorClasses).some(
  //   (e) => err instanceof errorClasses[e]
  // );
  // if (!isKnownError) {
  //   // Wrap error in a generic error class then return response to user
  //   // eslint-disable-next-line no-param-reassign
  //   err = new errorClasses.GenericError(err.message, err);
  // }
  return res.status(err.statusCode).send(err.error);
});

app.listen(port, () => {
  console.log(`Server Running on: ${port}`);
});

export default app;
