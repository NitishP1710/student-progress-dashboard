const express = require('express');
const router = express.Router();
const Student = require('../models/Students'); 
const { fetchAndUpdateStudentData } = require('../utils/codeforces');

router.get('/', async (req, res) => {
  const students = await Student.find();
  res.json(students);
});

router.post('/', async (req, res) => {
  const student = new Student(req.body);
  await student.save();
  res.json(student);
});

router.put('/:id', async (req, res) => {
  const updated = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (req.body.cfHandle) await fetchAndUpdateStudentData(updated);
  res.json(updated);
});

router.delete('/:id', async (req, res) => {
  await Student.findByIdAndDelete(req.params.id);
  res.sendStatus(204);
});

router.get('/:id/details', async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ error: "Student not found" });
    res.json(student);
  } catch (err) {
    res.status(400).json({ error: "Invalid ID format" });
  }
});

router.post('/:id/sync', async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    await fetchAndUpdateStudentData(student);
    const updated = await Student.findById(req.params.id);
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to sync data" });
  }
});

module.exports = router;
