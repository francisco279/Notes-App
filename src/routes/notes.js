const express = require("express");
const isAuthenticated = require("../helpers/auth");
const Note = require("../models/Note");
const router = express.Router();

//show form to add note
router.get("/notes/add", isAuthenticated, (req, res) => {
    res.render("notes/newnote");
});
//receive data for add new note and save on database
router.post("/notes/new-note", isAuthenticated, async(req, res) => {
    const { title, description } = req.body;
    const newNote = new Note({title, description});
    newNote.user = req.user.id;
    await newNote.save();
    res.redirect("/notes");
    
});
//get notes
router.get("/notes", isAuthenticated, async(req, res) => {
    const notes = await Note.find({user: req.user.id}).lean().sort({date: "desc"});
    const name = req.user.name;
    console.log(name);
    res.render("notes/allnotes", {notes, name});
});
//show the view to edit
router.get("/notes/edit/:id", isAuthenticated, async(req, res) => {
    const note = await Note.findById(req.params.id)
    console.log(note);
    res.render("notes/edit-note", note);
});
//edit a task
router.put("/notes/edit-note/:id", isAuthenticated, async(req, res) =>{
    const { title, description } = req.body;
    await Note.findByIdAndUpdate(req.params.id, { title, description });
    res.redirect("/notes");
});

router.delete("/notes/delete/:id", isAuthenticated, async(req, res) => {
    const note = await Note.findByIdAndDelete(req.params.id);
    res.redirect("/notes");
});

module.exports = router;