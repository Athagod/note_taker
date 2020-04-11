const express = require('express');
const notes = require('./db.json');
const fs = require('fs')

const PORT = process.env.PORT || 3000;

const app = express();
const path = require("path");

app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


app.get('/notes', function(_, res) {
    res.sendFile(path.join(__dirname, '/public/notes.html'));
});

app.get('/notes', function(_,res) {
    res.sendfile(path.join(__dirname, '/journal.json'))
});
//route to index.js
app.get('/notes', function(_, res) {
    res.sendfile(path.join(__dirname, '/js/index.js'))
});

app.get('/api/notes', (req, res) => {
    return res.json(notes);
});




app.get("/api/noteTest", (req, res) => {
    res.json("noteTest")
   
});




//posts notes to notes.html

app.post('/api/notes/', (req, res) => {
    let newNote = req.body;
    newNote.title = newNote.title; 

  notes.push(newNote);

  res.json(newNote);
})

function getId() {
    let id = Math.floor(Math.random() * 100000);
    return id;
  }


//to delete file
app.delete('/api/notes/:id', async (req, res) => {
    let deleteNote
    try{
        deleteNote = await notes.findbyID(req.params.id)
        await book.remove()
        res.redirect('/notes')

    } catch {

    }
})



//back to home page//
app.get('*', function(_, res) {
    res.sendFile(path.join(__dirname, '/public/index.html'));
});

//listener
app.listen(PORT, () => {
    console.log(`Server is listening on port: ${PORT}`);
});

module.exports = app