const express = require("express");
const admin = require("firebase-admin");
const fetch = require("node-fetch");
const path = require("path");

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));

var serviceAccount = require("./key.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

app.get("/", (req, res) => {
  res.render("index", { movies: null, movieDetails: null });
});

app.get("/signup", (req, res) => {
  res.render("signup");
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.post("/signupsubmit", async (req, res) => {
  const { fullName, email, password } = req.body;

  try {
    await db.collection("Details").add({
      Fullname: fullName,
      Email: email,
      Password: password
    });

    console.log("Signup Successful:", { fullName, email });
    res.send(`Signup successful for ${fullName}. <a href="/login">Click here to login</a>`);
  } catch (error) {
    console.error("Error saving user:", error);
    res.status(500).send("Error signing up. Please try again.");
  }
});

app.post("/loginsubmit", async (req, res) => {
  const { email, password } = req.body;

  try {
    const snapshot = await db.collection("Details")
      .where("Email", "==", email)
      .where("Password", "==", password)
      .get();

    if (snapshot.empty) {
      console.log("Invalid login details");
      res.send("Invalid login details. <a href='/login'>Try again</a>");
    } else {
      console.log("Login Successful:", { email });
      res.send(`Login successful for ${email}. <a href="/">Go to Home</a>`);
    }
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).send("Error logging in. Please try again.");
  }
});

const API_KEY = "a22a5464";

app.get("/api/search", async (req, res) => {
  const query = req.query.q;
  if (!query) return res.status(400).json({ error: "Missing search query" });
  try {
    const response = await fetch(`http://www.omdbapi.com/?apikey=${API_KEY}&s=${encodeURIComponent(query)}`);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Error fetching search results:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/api/movie/:id", async (req, res) => {
  const movieId = req.params.id;
  if (!movieId) return res.status(400).json({ error: "Missing movie ID" });
  try {
    const response = await fetch(`http://www.omdbapi.com/?apikey=${API_KEY}&i=${movieId}`);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Error fetching movie details:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
