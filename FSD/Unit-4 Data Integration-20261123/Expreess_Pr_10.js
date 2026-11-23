//const express = require("express");
import express from "express";

import mongoose from "mongoose";

//const mongoose = require("mongoose");

const app = express();

app.use(express.json());

// MongoDB Connection
mongoose
  .connect("mongodb://127.0.0.1:27017/mydatabase")
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));
//{ "name": "Kiran",   "age":20,   "course": "CN",   "email": "kiran@gmail.com"}
//{ name: "Sam",   age:20,   course: "FSD",   email: "sam@gmail.com"}

// Schema
const studentSchema = new mongoose.Schema({
  name: String,
  age: Number,
  course: String,
  email: String
});

// Model
const Student = mongoose.model("Student", studentSchema);

// CREATE
app.post("/students", async (req, res) => {
  try {
    const student = await Student.create(req.body);
    res.status(201).json(student);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// READ - All
app.get("/students", async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// READ - One
app.get("/students/:id", async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    res.json(student);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// UPDATE
app.put("/students/:id", async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(student);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE
app.delete("/students/:id", async (req, res) => {
  try {
    await Student.findByIdAndDelete(req.params.id);

    res.json({
      message: "Student deleted successfully"
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start Server
app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
