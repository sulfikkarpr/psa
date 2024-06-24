const express = require("express");
const sqlite3 = require("sqlite3");
const cors = require("cors");

const app = express();
const port = 3000;

// Enable CORS for the specific origin of your frontend
app.use(cors());

app.use(express.json());

const db = new sqlite3.Database("./tasks.db", (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log("Connected to the database.");

  db.run(
    "CREATE TABLE IF NOT EXISTS tasks (id INTEGER PRIMARY KEY AUTOINCREMENT, time TEXT, date TEXT, description TEXT)",
    (err) => {
      if (err) {
        console.error(err.message);
      } else {
        console.log("Tasks table is ready.");
      }
    }
  );
});

app.get("/", (req, res) => {
  res.send("Welcome to the NodeMCU Personal Assistant Server!");
});

app.get("/tasks", (req, res) => {
  db.all("SELECT * FROM tasks ORDER BY time ASC", (err, rows) => {
    if (err) {
      console.error(err.message);
      res.status(500).send("Error retrieving tasks");
    } else {
      res.json(rows);
    }
  });
});

app.post("/tasks", (req, res) => {
  const { time, date, description } = req.body;

  if (!time || !date || !description) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  db.run(
    "INSERT INTO tasks (time, date, description) VALUES (?, ?, ?)",
    [time, date, description],
    function (err) {
      if (err) {
        console.error(err.message);
        return res.status(500).send("Error adding task");
      }
      res.json({ message: "Task added successfully", id: this.lastID });
    }
  );
});

app.listen(port, "127.0.0.1", () => {
  console.log(`Server listening at http:/127.0.0.1:${port}/`);
});
