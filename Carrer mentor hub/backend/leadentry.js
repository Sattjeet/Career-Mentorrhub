// server.js
const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const app = express();

app.use(cors());
app.use(bodyParser.json());

// MySQL connection
const db = mysql.createConnection({
  host: "cmh-database-1.cdoa880021vr.ap-south-1.rds.amazonaws.com",
  user: "admin",
  password: "4NsmEWW8eA6ftcL",
  database: "mentor_hub",
  port: 3306
});

db.connect();

app.get("/reviews", (req, res) => {
  const query = "SELECT * FROM reviews";

  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching reviews:", err);
      res.status(500).json({ error: "Internal Server Error" });
    } else {
      res.json(results);
    }
  });
});

app.get("/leads", (req, res) => {
  const query = "SELECT * FROM leads";

  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching reviews:", err);
      res.status(500).json({ error: "Internal Server Error" });
    } else {
      console.log(results);
      res.json(results);
    }
  });
});

app.get("/announcements", (req, res) => {
  const query = "SELECT * FROM announcements";

  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching reviews:", err);
      res.status(500).json({ error: "Internal Server Error" });
    } else {
      console.log(results);
      res.json(results);
    }
  });
});

// API endpoint
app.post("/submit", (req, res) => {
  const { username, mobileno, emailid } = req.body;

  // Step 1: Check if the email already exists
  const checkSql = "SELECT * FROM leads WHERE email = ?";
  db.query(checkSql, [emailid], (err, results) => {
    if (err) {
      console.log(err);
      return res
        .status(500)
        .json({ message: "Database error during email check" });
    }

    if (results.length > 0) {
      // Email already exists
      return res.status(400).json({ message: "Email already registered!" });
    }

    // Step 2: Email is unique, proceed with insertion
    const insertSql =
      "INSERT INTO leads (username, telephone_number, email, registration_date) VALUES (?, ?, ?, CURDATE())";
    db.query(insertSql, [username, mobileno, emailid], (err, result) => {
      if (err) {
        console.log(err);
        return res
          .status(500)
          .json({ message: "Database error during insert" });
      }
      res.json({ message: "User added successfully!" });
    });
  });
});

app.post("/add-announcement", (req, res) => {
  const { announcement_heading, announcement } = req.body;
  const announcement_date = new Date().toISOString().split("T")[0]; // current date in YYYY-MM-DD

  const sql = `INSERT INTO announcements (announcement_heading, announcement, announcement_date)
                 VALUES (?, ?, ?)`;

  db.query(
    sql,
    [announcement_heading, announcement, announcement_date],
    (err, result) => {
      if (err) {
        console.error("Error inserting data:", err);
        res.status(500).send("Database error");
        return;
      }
    }
  );
});

app.post("/add-review", (req, res) => {
  const { reviewer_name, stars, review } = req.body;
  const review_date = new Date().toISOString().split("T")[0]; // current date in YYYY-MM-DD

  const sql = `INSERT INTO reviews (reviewer_name, stars, review,review_date)
                 VALUES (?, ?, ?, ?)`;

  db.query(sql, [reviewer_name, stars, review, review_date], (err, result) => {
    if (err) {
      console.error("Error inserting data:", err);
      res.status(500).send("Database error");
      return;
    }
  });
});

app.listen(3000, () => console.log("Server running on http://localhost:3000"));
