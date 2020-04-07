const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();
const notes = require("./db.json")


const PORT = process.env.PORT || 3000

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


app.get("/index", function(_, res) {
    res.sendFile(path.join(__dirname, "index.html"));
  });

app.get("/notes", function(_, res) {
    res.sendFile(path.join(__dirname, "/public/notes.html"))
});





  app.listen(PORT, function() {
      console.log(`App listening on PORT ${PORT}`)
  });