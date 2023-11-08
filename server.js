/*
Stavros Panagiotopoulos (stavrospana)
SCS Boot Camp Module 11 Weekly Challenge - Note Taker
Created 10/29/2023
Last Edited 11/07/2023
*/


// Imports the required modules
const fs = require("fs");
const path = require("path");

// Import and configure Express.js
const express = require("express");
const app = express();


// Serve static files from the "public" directory
app.use(express.static("public"));


// Import the UUID library 
const { v4: uuidv4 } = require("uuid");

// Set the server port 
const PORT = process.env.PORT || 3001;

// Enable JSON parsing for incoming requests
app.use(express.json());

// Enable URL-encoded data parsing for incoming requests
app.use(express.urlencoded({ extended: true }));

// Route to serve the "notes.html" page
app.get("/notes", (req, res) =>
  res.sendFile("./public/notes.html", { root: __dirname })
);

// Route to retrieve notes from the JSON data file
app.get("/api/notes", (req, res) =>
  res.sendFile("./db/db.json", { root: __dirname })
);

// Route to delete a note by ID
app.delete("/api/notes/:id", (req, res) => {
  const noteId = req.params.id;
  fs.readFile("./db/db.json", "utf8", (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to read the data file." });
    } else {
      const parsedData = JSON.parse(data);
      const result = parsedData.filter((note) => note.id !== noteId);
      fs.writeFile("./db/db.json", JSON.stringify(result), (err) => {
        if (err) {
          console.error(err);
          res.status(500).json({ error: "Failed to write data file." });
        } else {
          res.json(result);
        }
      });
    }
  });
});


// Route to add a new note
app.post("/api/notes", (req, res) => {
  fs.readFile("./db/db.json", "utf8", (err, data) => {
    if (err) {
      console.error(err);
    } else {
      req.body.id = uuidv4();
      const parsedData = JSON.parse(data);
      parsedData.push(req.body);
      console.log(parsedData);
      fs.writeFile("./db/db.json", JSON.stringify(parsedData), (err) =>
        err ? console.error(err) : res.json(parsedData)
      );
    }
  });
});

// Route to serve the "index.html" page for all other routes
app.get("*", (req, res) =>
  res.sendFile("./public/index.html", { root: __dirname })
);

// Start the server on the specified port
app.listen(PORT, () => {
  console.log("listening on port 3001");
});