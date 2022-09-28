import { default as jetvil } from "./src/index";
import router from "./src/lib/cm-api/routes/index";
import express from "express";

const jetvilCMS = jetvil();

console.log(jetvilCMS);

const app = express();

app.use(router);

app.listen(3000, () => {
  console.log("Server started on port 3000");
});
