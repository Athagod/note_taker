const $noteTitle = $(".note-title");
const $noteText = $(".note-textarea");
const $saveNoteBtn = $(".save-note");
const $newNoteBtn = $(".new-note");
const $noteList = $(".list-container .list-group");


let activeNote = {};


const getNotes = () => {
  return $.ajax({
    url: "/api/notes",
    method: "GET"
  });
};

//saving note//

const saveNote = (note) => {
  return $.ajax({
    url: "/api/notes", 
    data: note,
    method: "POST"
  });
};

//delete note// 
const deleteNote = (id) => {
  return $.ajax({
    url: "api/notes/" + id,
    method: "DELETE"
  });
};

// If note is active, display it//
const renderActiveNote = (note) => {

  $saveNoteBtn.hide();

  if (note.id) {
    $noteTitle.attr("readonly", true);
    $noteText.attr("readonly", true);
    $noteTitle.val(note.title);
    $noteText.val(note.text);
  } else {
    $noteTitle.attr("readonly", false);
    $noteText.attr("readonly", false);
    $noteTitle.val("");
    $noteText.val("");
  }
};

// save note to db and view update
const handleNoteSave = function() {
  const newNote = {
    title: $noteTitle.val(),
    text: $noteText.val(),
  };

  saveNote(newNote).then((data) => {
    getAndRenderNotes();
    renderActiveNote();
  });
};

// to delete note

const handleNoteDelete = (event) => {
  event.stopPropagation();

  const note = $(event.target)
    .parent(".list-group-item")
    .data();

  if (activeNote.id === note.id) {
    activeNote = {};
  }
  // make sure the success/then block gets called after deletion
  deleteNote(note.id).success(function() {
    getAndRenderNotes();
    renderActiveNote();
  });
};


const handleNoteView = () => {

  activeNote = $(event.taget).data();
  renderActiveNote(activeNote);
};


const handleNewNoteView = () => {
  activeNote = {};
  renderActiveNote();
};

// If a note's title or text are empty, hide the save button
// Or else show it
const handleRenderSaveBtn = () => {
  if (!$noteTitle.val().trim() || !$noteText.val().trim()) {
    $saveNoteBtn.hide();
  } else {
    $saveNoteBtn.show();
  }
};

//render list 
const renderNoteList = (notes) => {
  $noteList.empty();

  let noteListItems = [];

  for (var i = 0; i < notes.length; i++) {
    const note = notes[i];

    const $li = $("<li class='list-group-item'>").data(note);
    const $span = $("<span>").text(note.title);
    const $delBtn = $(
      "<i class='fas fa-trash-alt float-right text-danger delete-note'>"
    );

    $li.append($span, $delBtn);
    noteListItems.push($li);
  }

  $noteList.append(noteListItems);
};

//grab note from databass and render them to sidebar
const getAndRenderNotes = () => {
  return getNotes().then((data) => {
    renderNoteList(data);
  });
};

$saveNoteBtn.on("click", handleNoteSave);
$noteList.on("click", ".list-group-item", handleNoteView);
$newNoteBtn.on("click", handleNewNoteView);
$noteList.on("click", ".delete-note", handleNoteDelete);
$noteTitle.on("keyup", handleRenderSaveBtn);
$noteText.on("keyup", handleRenderSaveBtn);

// get and redner the inital note list 
getAndRenderNotes();