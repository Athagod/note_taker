const $noteTitle = $(".note-title");
const $noteText = $(".note-textarea");
const $saveNoteBtn = $(".save-note");
const $newNoteBtn = $(".new-note");
const $noteList = $(".list-container .list-group");

let activeNote = {};

const getNotes = () => {
    return $.ajax({
        url: "/api/notes",
        method: "Get"
    });
};

// saving note//

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

//If note is active, display it//
const renderActveNote = () => {
    $saveNoteBtn.hide();

    if (activeNote.id) {
        $noteTitle.attr("readonly", true);
        $noteText.attr("readonly", true);
        $noteTitle.val(activeNote.title);
        $noteText.val(activeNote.text);
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

//to delete note 

const handleNoteDelete = (event) => {
    event.stopProgation();

    const note = $(this)
        .parent(".list-group-item")
        .data();


     if (activeNote.id === note.id) {
         activeNote = {};
     }   

     deleteNote(note.id).then(function() {
         getAndRenderNotes();
         renderActveNote();
     });
};

const handleNOteView = function() {
    activeNote = $(this).data();
    renderActiveNote();
};

const handlNewNoteView = function() {
    activeNote = {};
    renderActiveNote();
};

// If a note's title or text are empty, hide the save button
// Or else show it

const handleRenderSaveBtn = function() {
    if (!$noteTitle.val().trim() || !$noteText.val().trim()) {
        $saveNoteBtn.hide();
    } else {
        $saveNoteBtn.show();
    }
};

const renderNoteList = (note) => {
    $noteList.empty();

    let noteListItems = [];

    for (var i = 0; i < note.length; i++) {
        const note = notes[i];

        const $li = $("<li class='lsitgroup-item'>").data(note);
        const $span = $("<span>").text(note.title);
        const $delBtn = $(
            "<i class='fas fa-trash-alt float-right text danger delete-note'>"
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

//get and render the initil note list 
getAndRenderNotes();