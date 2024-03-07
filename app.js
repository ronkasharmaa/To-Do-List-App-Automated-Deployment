import express from "express";
import bodyParser from "body-parser";
import { dirname } from "path";
import { fileURLToPath } from "url";
import postgres from "postgres";
import env from "dotenv";
env.config();

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const port = 3000;
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
var todayDate = "";
var list = [];

let { PGHOST, PGDATABASE, PGUSER, PGPASSWORD, ENDPOINT_ID } = process.env;
const db = postgres({
  host: PGHOST,
  database: PGDATABASE,
  username: PGUSER,
  password: PGPASSWORD,
  port: 5432,
  ssl: "require",
  connection: {
    options: `project=${ENDPOINT_ID}`,
  },
});

function setDate(req, res, next) {
  var month;
  var day;
  var dat;
  const today = new Date();
  switch (today.getMonth()) {
    case 0:
      month = "January";
      break;
    case 1:
      month = "February";
      break;
    case 2:
      month = "March";
      break;
    case 3:
      month = "April";
      break;
    case 4:
      month = "May";
      break;
    case 5:
      month = "June";
      break;
    case 6:
      month = "July";
      break;
    case 7:
      month = "August";
      break;
    case 8:
      month = "September";
      break;
    case 9:
      month = "October";
      break;
    case 10:
      month = "November";
      break;
    case 11:
      month = "December";
      break;
  }
  switch (today.getDay()) {
    case 0:
      day = "Sunday";
      break;
    case 1:
      day = "Monday";
      break;
    case 2:
      day = "Tuesday";
      break;
    case 3:
      day = "Wednesday";
      break;
    case 4:
      day = "Thursday";
      break;
    case 5:
      day = "Friday";
      break;
    case 6:
      day = "Saturday";
      break;
  }
  dat = today.getDate();
  todayDate = day + ", " + month + " " + dat;
  next();
}
app.use(setDate);

async function getList1() {
  const result = await db`SELECT * FROM today_items`;
  return result;
}

async function getList2() {
  const result = await db`SELECT * FROM work_items`;
  list = result.rows;
  return result;
}

app.get("/", async (req, res) => {
  const list = await getList1();
  let length = list.length;
  res.render(__dirname + "/views/index.ejs", {
    date: todayDate,
    values: list,
    len: length,
  });
});

app.post("/", async (req, res) => {
  var inputValue = req.body["newItem"];
  try {
    await db`INSERT INTO today_items (title) VALUES (${inputValue})`;
    res.redirect("/");
  } catch (error) {
    console.log(error);
  }
});

app.post("/todedit", async (req, res) => {
  var updateId = req.body.updatedListId;
  var updateTitle = req.body.updatedListTitle;
  try {
    await db`UPDATE today_items SET title = ${updateTitle} WHERE id = ${updateId}`;
    res.redirect("/");
  } catch (error) {
    console.log(error);
  }
});

app.post("/toddelete", async (req, res) => {
  var deletedId = req.body.deletedItemId;
  try {
    await db`DELETE FROM today_items WHERE id = ${deletedId}`;
    res.redirect("/");
  } catch (error) {
    console.log(error);
  }
});

app.get("/work", async (req, res) => {
  const list = await getList2();
  let length = list.length;
  res.render(__dirname + "/views/work.ejs", {
    values: list,
    len: length,
  });
});

app.post("/work", async (req, res) => {
  var inputValue = req.body["newItem"];
  try {
    await db`INSERT INTO work_items (title) VALUES (${inputValue})`;
    res.redirect("/work");
  } catch (error) {
    console.log(error);
  }
});

app.post("/woredit", async (req, res) => {
  var updateId = req.body.updatedListId;
  var updateTitle = req.body.updatedListTitle;
  try {
    await db(
      `UPDATE work_items SET title = ${updateTitle} WHERE id = ${updateId}`
    );
    res.redirect("/work");
  } catch (error) {
    console.log(error);
  }
});

app.post("/wordelete", async (req, res) => {
  var deletedId = req.body.deletedItemId;
  try {
    await db`DELETE FROM work_items WHERE id = ${deletedId}`;
    res.redirect("/");
  } catch (error) {
    console.log(error);
  }
});

app.listen(port, () => {
  console.log(`Server is running on ${port}`);
});
