const PORT = process.env.PORT ?? 3001;
const express = require("express");
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");
const app = express();
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const pool = require("./db");
const cors = require("cors");
app.use(cors());
app.use(bodyParser.json());
// app.get("/", (req, res) => {
//   res.send("test");
// });

// get all todos
app.get("/todos/:userEmail", async (req, res) => {
  const { userEmail } = req.params;

  try {
    const result = await pool.query(
      "SELECT * FROM todos WHERE user_email =$1",
      [userEmail]
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
  }
});

// create a todo item
app.post("/todos", async (req, res) => {
  const { user_email, title, progress, date } = req.body;
  const id = uuidv4();
  try {
    const result = pool.query(
      `INSERT INTO todos(id, user_email, title, progress, date) VALUES ($1, $2, $3, $4, $5);`,
      [id, user_email, title, progress, date]
    );
    res.send(result);
  } catch (error) {
    res.send(error);
  }
});

// edit a todo item
app.put("/todos/:id", async (req, res) => {
  const { id } = req.params;
  const { user_email, title, progress, date } = req.body;
  try {
    const result = await pool.query(
      `UPDATE todos SET user_email = $1, title = $2, progress = $3, date = $4 WHERE id = $5;`,
      [user_email, title, progress, date, id]
    );
    res.send(result);
  } catch (err) {
    console.error(err);
  }
});

// delete a todo item
app.delete("/todos/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query("DELETE FROM todos WHERE id = $1", [id]);
    res.json(result);
  } catch (err) {
    console.error(err);
  }
});

//login
app.post("/auth/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    if (!user.rowCount) {
      res.json({ detail: "Invalid creds" });
      return;
    }
    console.log(user);
    const success = await bcrypt.compare(
      password,
      user.rows[0].hashed_password
    );
    console.log(success);
    if (success) {
      const token = jwt.sign({ email }, "secret", { expiresIn: "24hr" });
      res.json({ email: user.rows[0].email, token });
    } else {
      return res.json({ detail: "Invalid creds" });
    }
    console.log(result);
  } catch (err) {
    console.error(err);
  }
});

//sign up
app.post("/auth/sign-up", async (req, res) => {
  console.log(req.body);
  const { email, password } = req.body;
  //   const id = uuidv4();
  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(password, salt);
  try {
    const result = await pool.query(
      `INSERT INTO users(email, hashed_password) VALUES ($1, $2);`,
      [email, hashedPassword]
    );
    const token = jwt.sign({ email }, "secret", { expiresIn: "24hr" });
    res.json({ email, token });
    console.log(result);
  } catch (err) {
    console.error(err);
    res.json({ detail: err.detail });
  }
});

app.listen(PORT, () => console.log(`backend running on port ${PORT}`));
